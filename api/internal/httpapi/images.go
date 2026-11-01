package httpapi

import (
	"bytes"
	"errors"
	"io"
	"net/http"
	"strings"
	"unicode/utf8"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/blobs"
	"github.com/anothrNick/isodraw/api/internal/store"
)

// A workspace's images: uploaded once, then on the Images tab of every diagram
// in the workspace, for everyone in it. Each image has an unguessable public
// link (/i/<token>.<ext>) that diagrams store, so preview pictures, published
// pages and AI apps can show it without signing in.

// MaxImageBytes caps one uploaded image.
const MaxImageBytes = 5 << 20

const maxImageName = 120

// imageTypes are the formats accepted, with the extension their links end in.
var imageTypes = map[string]string{
	"image/png":     ".png",
	"image/jpeg":    ".jpg",
	"image/gif":     ".gif",
	"image/webp":    ".webp",
	"image/svg+xml": ".svg",
}

func (s *Server) imageRoutes(api *http.ServeMux) {
	api.HandleFunc("GET /api/orgs/{org}/images", s.listImages)
	api.HandleFunc("POST /api/orgs/{org}/images", s.uploadImage)
	api.HandleFunc("DELETE /api/orgs/{org}/images/{id}", s.removeImage)
}

type imageJSON struct {
	store.Image
	URL string `json:"url"`
}

func (s *Server) imageJSON(i store.Image) imageJSON {
	return imageJSON{Image: i, URL: s.cfg.PublicURL + "/i/" + i.Token + imageTypes[i.ContentType]}
}

func (s *Server) listImages(w http.ResponseWriter, r *http.Request) {
	org := r.PathValue("org")
	if _, ok := s.orgRole(w, r, org); !ok {
		return
	}
	list, err := s.store.Images(r.Context(), org)
	if err != nil {
		internalError(w, err)
		return
	}
	out := make([]imageJSON, len(list))
	for n, i := range list {
		out[n] = s.imageJSON(i)
	}
	writeJSON(w, http.StatusOK, map[string]any{"images": out})
}

// uploadImage takes the image's bytes as the body, with its type as Content-Type and ?name=.
func (s *Server) uploadImage(w http.ResponseWriter, r *http.Request) {
	org := r.PathValue("org")
	role, ok := s.orgRole(w, r, org)
	if !ok {
		return
	}
	if !role.CanEdit() {
		writeError(w, http.StatusForbidden, "forbidden", "Viewers can't add images to this workspace.")
		return
	}
	contentType := strings.TrimSpace(strings.SplitN(r.Header.Get("Content-Type"), ";", 2)[0])
	if _, ok := imageTypes[contentType]; !ok {
		writeError(w, http.StatusUnsupportedMediaType, "unsupported_media_type", "Upload a PNG, JPEG, GIF, WebP or SVG image.")
		return
	}
	data, err := io.ReadAll(http.MaxBytesReader(w, r.Body, MaxImageBytes))
	var tooBig *http.MaxBytesError
	if errors.As(err, &tooBig) {
		writeError(w, http.StatusRequestEntityTooLarge, "too_large", "Images can be up to 5 MB.")
		return
	}
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad_request", "Could not read the image.")
		return
	}
	if !looksLike(contentType, data) {
		writeError(w, http.StatusBadRequest, "invalid_image", "That file isn't the kind of image it says it is.")
		return
	}
	name := strings.TrimSpace(r.URL.Query().Get("name"))
	if name == "" {
		name = "Image"
	}
	if utf8.RuneCountInString(name) > maxImageName {
		name = string([]rune(name)[:maxImageName])
	}
	token, err := store.NewImageToken()
	if err != nil {
		internalError(w, err)
		return
	}
	if err := s.files.Put(r.Context(), store.ImageKey(token), contentType, data); err != nil {
		internalError(w, err)
		return
	}
	img, err := s.store.CreateImage(r.Context(), org, auth.User(r.Context()).ID, name, token, contentType, len(data))
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, s.imageJSON(img))
}

// looksLike checks the bytes are the type claimed, so a link ending in .png serves a PNG.
func looksLike(contentType string, data []byte) bool {
	if contentType == "image/svg+xml" {
		head := bytes.ToLower(data[:min(len(data), 4096)])
		return bytes.Contains(head, []byte("<svg"))
	}
	return http.DetectContentType(data) == contentType
}

func (s *Server) removeImage(w http.ResponseWriter, r *http.Request) {
	org, id := r.PathValue("org"), r.PathValue("id")
	role, ok := s.orgRole(w, r, org)
	if !ok {
		return
	}
	if !role.CanEdit() {
		writeError(w, http.StatusForbidden, "forbidden", "Viewers can't remove images from this workspace.")
		return
	}
	if !isUUID(id) {
		writeError(w, http.StatusNotFound, "not_found", "No such image.")
		return
	}
	err := s.store.RemoveImage(r.Context(), org, id)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such image.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// publicImage serves an image to anyone with its link. Links never change what
// they point at, so they are cached for good. An SVG gets a policy that stops
// any script or outside fetch in it, in case someone opens the link itself.
func (s *Server) publicImage(w http.ResponseWriter, r *http.Request) {
	token, _, _ := strings.Cut(r.PathValue("file"), ".")
	img, err := s.store.ImageByToken(r.Context(), token)
	if errors.Is(err, store.ErrNotFound) {
		http.NotFound(w, r)
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	body, err := s.files.Get(r.Context(), store.ImageKey(img.Token))
	if errors.Is(err, blobs.ErrNotFound) {
		http.NotFound(w, r)
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	defer body.Close()
	h := w.Header()
	h.Set("Content-Type", img.ContentType)
	h.Set("Cache-Control", "public, max-age=31536000, immutable")
	h.Set("X-Content-Type-Options", "nosniff")
	h.Set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox")
	// Exports draw images onto a canvas, which needs CORS for another origin.
	h.Set("Access-Control-Allow-Origin", "*")
	_, _ = io.Copy(w, body)
}
