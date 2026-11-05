package email

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
)

type ses struct {
	client    *sesv2.Client
	from      string
	replyTo   []string
	configSet *string
}

func newSES(_ context.Context, s Settings) (Sender, error) {
	if s.SESAccessKeyID == "" || s.SESSecretAccessKey == "" {
		return nil, errors.New("EMAIL_PROVIDER=ses needs SES_ACCESS_KEY_ID and SES_SECRET_ACCESS_KEY")
	}
	if _, err := address("EMAIL_FROM", s.From); err != nil {
		return nil, err
	}
	out := &ses{from: s.From}
	if s.ReplyTo != "" {
		if _, err := address("EMAIL_REPLY_TO", s.ReplyTo); err != nil {
			return nil, err
		}
		out.replyTo = []string{s.ReplyTo}
	}
	if s.SESConfigSet != "" {
		out.configSet = aws.String(s.SESConfigSet)
	}
	region := s.SESRegion
	if region == "" {
		region = "us-east-1"
	}
	out.client = sesv2.New(sesv2.Options{
		Region:      region,
		Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(s.SESAccessKeyID, s.SESSecretAccessKey, "")),
	})
	return out, nil
}

func (s *ses) Send(ctx context.Context, m Message) error {
	utf8 := aws.String("UTF-8")
	_, err := s.client.SendEmail(ctx, &sesv2.SendEmailInput{
		FromEmailAddress:     aws.String(s.from),
		Destination:          &types.Destination{ToAddresses: []string{m.To}},
		ReplyToAddresses:     s.replyTo,
		ConfigurationSetName: s.configSet,
		Content: &types.EmailContent{Simple: &types.Message{
			Subject: &types.Content{Data: aws.String(m.Subject), Charset: utf8},
			Body: &types.Body{
				Text: &types.Content{Data: aws.String(m.Text), Charset: utf8},
				Html: &types.Content{Data: aws.String(m.HTML), Charset: utf8},
			},
		}},
	})
	return err
}
