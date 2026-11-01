// Command isodraw runs the IsoDraw server.
//
//	isodraw                          migrate the database, then serve (the default)
//	isodraw migrate                  only migrate the database
//	isodraw lifetime grant <email>   give someone lifetime access by hand (comps, testing)
//	isodraw lifetime revoke <email>  take it back
//	isodraw admin grant|revoke <email>  make someone a platform admin (local accounts;
//	                                   with Cognito, use the admins group instead)
package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/blobs"
	"github.com/anothrNick/isodraw/api/internal/config"
	"github.com/anothrNick/isodraw/api/internal/db"
	"github.com/anothrNick/isodraw/api/internal/httpapi"
	"github.com/anothrNick/isodraw/api/internal/store"
)

func main() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, nil)))
	if err := run(); err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
}

func run() error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg, err := config.FromEnv()
	if err != nil {
		return fmt.Errorf("configuration:\n%w", err)
	}
	if err := db.Migrate(ctx, cfg.DatabaseURL); err != nil {
		return err
	}
	cmd := "serve"
	if len(os.Args) > 1 {
		cmd = os.Args[1]
	}
	switch cmd {
	case "migrate":
		slog.Info("database is up to date")
		return nil
	case "serve":
		return serve(ctx, cfg)
	case "lifetime":
		return lifetime(ctx, cfg, os.Args[2:])
	case "admin":
		return admin(ctx, cfg, os.Args[2:])
	default:
		return fmt.Errorf("unknown command %q (use serve, migrate, lifetime or admin)", cmd)
	}
}

func lifetime(ctx context.Context, cfg config.Config, args []string) error {
	if len(args) != 2 || (args[0] != "grant" && args[0] != "revoke") {
		return errors.New("usage: isodraw lifetime grant|revoke <email>")
	}
	pool, err := db.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		return err
	}
	defer pool.Close()
	n, err := store.New(pool).SetLifetime(ctx, args[1], args[0] == "grant")
	if err != nil {
		return err
	}
	if n == 0 {
		return fmt.Errorf("no account with the email %s", args[1])
	}
	slog.Info(map[string]string{"grant": "lifetime access granted", "revoke": "lifetime access revoked"}[args[0]], "email", args[1])
	return nil
}

func admin(ctx context.Context, cfg config.Config, args []string) error {
	if len(args) != 2 || (args[0] != "grant" && args[0] != "revoke") {
		return errors.New("usage: isodraw admin grant|revoke <email>")
	}
	pool, err := db.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		return err
	}
	defer pool.Close()
	n, err := store.New(pool).SetPlatformAdminByEmail(ctx, args[1], args[0] == "grant")
	if err != nil {
		return err
	}
	if n == 0 {
		return fmt.Errorf("no account with the email %s", args[1])
	}
	if cfg.AuthMode != "local" {
		slog.Warn("with " + cfg.AuthMode + " sign-in, the " + cfg.AdminGroup + " group decides this again at their next sign-in")
	}
	slog.Info(map[string]string{"grant": "platform admin granted", "revoke": "platform admin revoked"}[args[0]], "email", args[1])
	return nil
}

func serve(ctx context.Context, cfg config.Config) error {
	pool, err := db.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		return err
	}
	defer pool.Close()
	s := store.New(pool)
	a, err := auth.New(cfg, s)
	if err != nil {
		return err
	}
	files := blobs.Dir(cfg.ImageDir)
	if cfg.BucketName != "" {
		if files, err = blobs.Bucket(ctx, cfg.BucketName); err != nil {
			return err
		}
	}
	srv := &http.Server{
		Addr:              cfg.Addr,
		Handler:           httpapi.New(cfg, s, a, files),
		ReadHeaderTimeout: 10 * time.Second,
	}
	errc := make(chan error, 1)
	go func() {
		slog.Info("listening", "addr", cfg.Addr, "public_url", cfg.PublicURL)
		errc <- srv.ListenAndServe()
	}()
	select {
	case err := <-errc:
		return err
	case <-ctx.Done():
	}
	shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdown); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	slog.Info("stopped")
	return nil
}
