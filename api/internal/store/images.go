package store

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"time"

	"github.com/jackc/pgx/v5"
)

// Image is a workspace's uploaded image. Its bytes are in blob storage under ImageKey(Token).
type Image struct {
	ID          string    `json:"id"`
	OrgID       string    `json:"orgId"`
	Name        string    `json:"name"`
	Token       string    `json:"-"`
	ContentType string    `json:"contentType"`
	Size        int       `json:"size"`
	UploadedBy  string    `json:"uploadedBy"`
	CreatedAt   time.Time `json:"createdAt"`
}

// ImageKey is where an image's bytes are kept.
func ImageKey(token string) string { return "images/" + token }

// NewImageToken makes the unguessable part of an image's public link.
func NewImageToken() (string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

const imageCols = `i.id, i.org_id, i.name, i.token, i.content_type, i.size, coalesce(nullif(u.name, ''), u.email, ''), i.created_at`

func scanImage(r pgx.Row) (Image, error) {
	var i Image
	err := r.Scan(&i.ID, &i.OrgID, &i.Name, &i.Token, &i.ContentType, &i.Size, &i.UploadedBy, &i.CreatedAt)
	return i, err
}

// CreateImage records an uploaded image whose bytes are already stored.
func (s *Store) CreateImage(ctx context.Context, orgID, userID, name, token, contentType string, size int) (Image, error) {
	return scanImage(s.db.QueryRow(ctx, `
		with i as (
		  insert into images (org_id, created_by, name, token, content_type, size)
		  values ($1, $2, $3, $4, $5, $6) returning *
		)
		select `+imageCols+` from i left join users u on u.id = i.created_by`,
		orgID, userID, name, token, contentType, size))
}

// Images lists a workspace's images, oldest first, like the order they were added.
func (s *Store) Images(ctx context.Context, orgID string) ([]Image, error) {
	rows, err := s.db.Query(ctx, `select `+imageCols+` from images i left join users u on u.id = i.created_by
		where i.org_id = $1 and i.removed_at is null order by i.created_at, i.id`, orgID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (Image, error) { return scanImage(r) })
}

// RemoveImage takes an image off the workspace's list. Its link keeps working for diagrams that use it.
func (s *Store) RemoveImage(ctx context.Context, orgID, id string) error {
	tag, err := s.db.Exec(ctx, `update images set removed_at = now() where id = $1 and org_id = $2 and removed_at is null`, id, orgID)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return notFound(err)
}

// ImageByToken finds an image by its link, removed or not.
func (s *Store) ImageByToken(ctx context.Context, token string) (Image, error) {
	i, err := scanImage(s.db.QueryRow(ctx, `select `+imageCols+` from images i left join users u on u.id = i.created_by where i.token = $1`, token))
	return i, notFound(err)
}
