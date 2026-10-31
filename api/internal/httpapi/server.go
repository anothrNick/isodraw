// Package httpapi is the HTTP surface: /auth for sign-in, /api for JSON, and
// optionally the built web app for every other path.
package httpapi

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/config"
	"github.com/anothrNick/isodraw/api/internal/store"
)

type Server struct {
	cfg   config.Config
	store *store.Store
	auth  *auth.Auth
}

func New(cfg config.Config, s *store.Store, a *auth.Auth) http.Handler {
	srv := &Server{cfg: cfg, store: s, auth: a}
	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusNoContent) })

	mux.HandleFunc("GET /auth/login", a.Login)
	mux.HandleFunc("GET /auth/callback", a.Callback)
	mux.Handle("POST /auth/logout", srv.sameOrigin(http.HandlerFunc(a.Logout)))

	api := http.NewServeMux()
	api.HandleFunc("GET /api/me", srv.me)
	api.HandleFunc("GET /api/orgs/{org}/diagrams", srv.listDiagrams)
	api.HandleFunc("POST /api/orgs/{org}/diagrams", srv.createDiagram)
	api.HandleFunc("GET /api/diagrams/{id}", srv.getDiagram)
	api.HandleFunc("PUT /api/diagrams/{id}/content", srv.saveContent)
	api.HandleFunc("PATCH /api/diagrams/{id}", srv.updateDiagram)
	api.HandleFunc("DELETE /api/diagrams/{id}", srv.deleteDiagram)
	api.HandleFunc("/api/", func(w http.ResponseWriter, _ *http.Request) {
		writeError(w, http.StatusNotFound, "not_found", "No such API route.")
	})
	mux.Handle("/api/", noStore(srv.sameOrigin(a.RequireUser(api))))

	if cfg.WebDir != "" {
		mux.Handle("/", spa(cfg.WebDir))
	}
	return logRequests(mux)
}

// ---------- middleware ----------

// sameOrigin refuses changing requests from other sites. Browsers send Origin
// on cross-site POST, PUT, PATCH and DELETE; it must be this app's own origin.
func (s *Server) sameOrigin(next http.Handler) http.Handler {
	own := origin(s.cfg.PublicURL)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			if o := r.Header.Get("Origin"); o != "" && o != own {
				writeError(w, http.StatusForbidden, "cross_origin", "Requests must come from the app itself.")
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}

func noStore(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(sw, r)
		if r.URL.Path == "/healthz" {
			return
		}
		slog.Info("request", "method", r.Method, "path", r.URL.Path, "status", sw.status, "ms", time.Since(start).Milliseconds())
	})
}

// spa serves the built web app, falling back to index.html so client-side routes load the app.
func spa(dir string) http.Handler {
	files := http.FileServer(http.Dir(dir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p := filepath.Join(dir, filepath.FromSlash(filepath.Clean("/"+r.URL.Path)))
		if info, err := os.Stat(p); err != nil || info.IsDir() {
			w.Header().Set("Cache-Control", "no-cache")
			http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}
		if strings.HasPrefix(r.URL.Path, "/assets/") {
			// Vite puts a content hash in these names.
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		}
		files.ServeHTTP(w, r)
	})
}

// ---------- JSON helpers ----------

type apiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, code, msg string) {
	writeJSON(w, status, map[string]apiError{"error": {Code: code, Message: msg}})
}

func internalError(w http.ResponseWriter, err error) {
	slog.Error("request failed", "err", err)
	writeError(w, http.StatusInternalServerError, "internal", "Something went wrong.")
}

// decode reads a JSON body of at most `limit` bytes into v.
func decode(w http.ResponseWriter, r *http.Request, limit int64, v any) bool {
	if ct := r.Header.Get("Content-Type"); !strings.HasPrefix(ct, "application/json") {
		writeError(w, http.StatusUnsupportedMediaType, "unsupported_media_type", "Send JSON with Content-Type: application/json.")
		return false
	}
	r.Body = http.MaxBytesReader(w, r.Body, limit)
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		var tooBig *http.MaxBytesError
		if errors.As(err, &tooBig) {
			writeError(w, http.StatusRequestEntityTooLarge, "too_large", "The request body is too large.")
		} else {
			writeError(w, http.StatusBadRequest, "invalid_json", "The request body is not valid JSON.")
		}
		return false
	}
	return true
}

var uuidRE = regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)

func isUUID(s string) bool { return uuidRE.MatchString(s) }

func origin(u string) string {
	p, err := url.Parse(u)
	if err != nil {
		return ""
	}
	return p.Scheme + "://" + p.Host
}
