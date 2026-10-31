// Command isodraw runs the IsoDraw server.
//
//	isodraw          migrate the database, then serve (the default)
//	isodraw migrate  only migrate the database
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
	default:
		return fmt.Errorf("unknown command %q (use serve or migrate)", cmd)
	}
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
	srv := &http.Server{
		Addr:              cfg.Addr,
		Handler:           httpapi.New(cfg, s, a),
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
