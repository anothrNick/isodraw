// Package blobs keeps file bytes, such as uploaded images: in an S3-compatible
// bucket (Tigris on Fly) in production, or in a folder for development and tests.
package blobs

import (
	"bytes"
	"context"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

var ErrNotFound = errors.New("blob not found")

type Store interface {
	Put(ctx context.Context, key, contentType string, data []byte) error
	// Get returns the blob's bytes; the caller closes them.
	Get(ctx context.Context, key string) (io.ReadCloser, error)
}

// ---------- folder ----------

type dir struct{ root string }

// Dir keeps blobs as files under root.
func Dir(root string) Store { return dir{root} }

func (d dir) path(key string) (string, error) {
	p := filepath.Join(d.root, filepath.FromSlash(key))
	if !strings.HasPrefix(p, filepath.Clean(d.root)+string(filepath.Separator)) {
		return "", errors.New("blob key escapes the folder")
	}
	return p, nil
}

func (d dir) Put(_ context.Context, key, _ string, data []byte) error {
	p, err := d.path(key)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
		return err
	}
	return os.WriteFile(p, data, 0o644)
}

func (d dir) Get(_ context.Context, key string) (io.ReadCloser, error) {
	p, err := d.path(key)
	if err != nil {
		return nil, err
	}
	f, err := os.Open(p)
	if errors.Is(err, os.ErrNotExist) {
		return nil, ErrNotFound
	}
	return f, err
}

// ---------- bucket ----------

type bucket struct {
	client *s3.Client
	name   string
}

// Bucket keeps blobs in an S3-compatible bucket. Credentials, region and
// endpoint come from the usual AWS_* variables, which `fly storage create` sets.
func Bucket(ctx context.Context, name string) (Store, error) {
	cfg, err := awsconfig.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, err
	}
	return bucket{client: s3.NewFromConfig(cfg), name: name}, nil
}

func (b bucket) Put(ctx context.Context, key, contentType string, data []byte) error {
	_, err := b.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(b.name),
		Key:         aws.String(key),
		Body:        bytes.NewReader(data),
		ContentType: aws.String(contentType),
	})
	return err
}

func (b bucket) Get(ctx context.Context, key string) (io.ReadCloser, error) {
	out, err := b.client.GetObject(ctx, &s3.GetObjectInput{Bucket: aws.String(b.name), Key: aws.String(key)})
	var missing *types.NoSuchKey
	if errors.As(err, &missing) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return out.Body, nil
}
