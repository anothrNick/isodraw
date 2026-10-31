// Package testdb gives each test its own migrated Postgres database, created
// on the server at TEST_DATABASE_URL (default: the local compose Postgres)
// and dropped afterwards. Without a reachable server, tests skip, except in
// CI where they fail.
package testdb

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/url"
	"os"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/anothrNick/isodraw/api/internal/db"
)

const defaultURL = "postgres://isodraw:isodraw@localhost:5433/isodraw?sslmode=disable"

// New returns a pool on a fresh database, and the database's URL.
func New(t *testing.T) (*pgxpool.Pool, string) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	admin := os.Getenv("TEST_DATABASE_URL")
	if admin == "" {
		admin = defaultURL
	}
	conn, err := pgx.Connect(ctx, admin)
	if err != nil {
		if os.Getenv("CI") != "" {
			t.Fatalf("test database: %v", err)
		}
		t.Skipf("no test database (start it with `docker compose up -d`): %v", err)
	}
	defer conn.Close(ctx)

	b := make([]byte, 6)
	_, _ = rand.Read(b)
	name := "isodraw_test_" + hex.EncodeToString(b)
	if _, err := conn.Exec(ctx, "create database "+name); err != nil {
		t.Fatalf("create test database: %v", err)
	}
	u, _ := url.Parse(admin)
	u.Path = "/" + name
	dbURL := u.String()

	if err := db.Migrate(ctx, dbURL); err != nil {
		t.Fatal(err)
	}
	pool, err := db.Open(ctx, dbURL)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		pool.Close()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		c, err := pgx.Connect(ctx, admin)
		if err != nil {
			return
		}
		defer c.Close(ctx)
		_, _ = c.Exec(ctx, "drop database if exists "+name+" with (force)")
	})
	return pool, dbURL
}
