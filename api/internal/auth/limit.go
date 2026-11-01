package auth

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

// limiter allows a number of attempts per key in a sliding window, to slow
// down password guessing and code spraying. It's in memory, per machine;
// Cognito has its own limits behind it.
type limiter struct {
	mu     sync.Mutex
	window time.Duration
	max    int
	hits   map[string][]time.Time
}

func newLimiter(max int, window time.Duration) *limiter {
	return &limiter{window: window, max: max, hits: map[string][]time.Time{}}
}

// allow records an attempt and reports whether it's within the limit.
func (l *limiter) allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	recent := l.hits[key][:0]
	for _, t := range l.hits[key] {
		if now.Sub(t) < l.window {
			recent = append(recent, t)
		}
	}
	if len(recent) >= l.max {
		l.hits[key] = recent
		return false
	}
	l.hits[key] = append(recent, now)
	// Forget idle keys now and then so the map doesn't grow without end.
	if len(l.hits) > 10_000 {
		for k, ts := range l.hits {
			if len(ts) == 0 || now.Sub(ts[len(ts)-1]) > l.window {
				delete(l.hits, k)
			}
		}
	}
	return true
}

// clientIP is the address the request came from: Cloudflare's header in
// production (the site forwards through it), then Fly's, then the socket.
func clientIP(r *http.Request) string {
	for _, h := range []string{"CF-Connecting-IP", "Fly-Client-IP"} {
		if v := strings.TrimSpace(r.Header.Get(h)); v != "" {
			return v
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

// Limiter is the rate limiter, for other packages' endpoints (OAuth client registration).
type Limiter = limiter

// NewLimiter allows max attempts per key in each window.
func NewLimiter(max int, window time.Duration) *Limiter { return newLimiter(max, window) }

// Allow records an attempt and reports whether it's within the limit.
func (l *limiter) Allow(key string) bool { return l.allow(key) }

// ClientIP is the address a request came from, as the limits see it.
func ClientIP(r *http.Request) string { return clientIP(r) }
