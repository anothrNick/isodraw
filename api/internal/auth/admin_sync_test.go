package auth

import (
	"context"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/anothrNick/isodraw/api/internal/config"
	"github.com/anothrNick/isodraw/api/internal/store"
	"github.com/anothrNick/isodraw/api/internal/testdb"
)

// The identity provider's admin group decides platform admin at each sign-in;
// a provider that sends no groups (local accounts) leaves the flag alone.
func TestSignInSyncsPlatformAdmin(t *testing.T) {
	pool, _ := testdb.New(t)
	s := store.New(pool)
	cfg := config.Config{PublicURL: "http://localhost:5190", OIDCIssuer: "http://127.0.0.1:1/unused", OIDCClientID: "x",
		SessionSecret: "test-secret-0123456789", SessionTTL: time.Hour, AdminGroup: "admins"}
	a, err := New(cfg, s)
	if err != nil {
		t.Fatal(err)
	}
	signIn := func(groups []string) bool {
		t.Helper()
		w := httptest.NewRecorder()
		if !a.startSession(w, httptest.NewRequest("POST", "/auth/signin", nil), Identity{Issuer: "iss", Subject: "sub", Email: "ada@example.com", Groups: groups}) {
			t.Fatal(w.Body.String())
		}
		u, err := s.UpsertUser(context.Background(), "iss", "sub", "ada@example.com", "")
		if err != nil {
			t.Fatal(err)
		}
		admin, err := s.IsPlatformAdmin(context.Background(), u.ID)
		if err != nil {
			t.Fatal(err)
		}
		return admin
	}
	if signIn([]string{"admins", "other"}) != true {
		t.Fatal("in the admins group: an admin")
	}
	if signIn(nil) != true {
		t.Fatal("no groups claim at all leaves the flag as it was")
	}
	if signIn([]string{}) != false {
		t.Fatal("out of the group: no longer an admin")
	}
}
