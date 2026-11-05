# Email through Amazon SES: the sending domain (DKIM and a custom MAIL FROM, so
# SPF and DKIM both align with it for DMARC), a configuration set that stops
# sending to addresses that bounced or complained, and an IAM user that may
# only send from email_from, for the API's invite and welcome emails.
#
# The DNS records go in by hand (see the dns_records output), and SES starts
# in a sandbox: ask AWS for production access before turning on
# cognito_email_via_ses or sending to people.

locals {
  email       = var.email_domain != ""
  mail_from   = "mail.${var.email_domain}"
  from_header = "${var.email_from_name} <${var.email_from}>"
}

resource "aws_sesv2_email_identity" "isodraw" {
  count          = local.email ? 1 : 0
  email_identity = var.email_domain
  # Easy DKIM, 2048-bit keys that SES rotates.
  dkim_signing_attributes {
    next_signing_key_length = "RSA_2048_BIT"
  }
}

resource "aws_sesv2_email_identity_mail_from_attributes" "isodraw" {
  count                  = local.email ? 1 : 0
  email_identity         = aws_sesv2_email_identity.isodraw[0].email_identity
  mail_from_domain       = local.mail_from
  behavior_on_mx_failure = "USE_DEFAULT_VALUE"
}

resource "aws_sesv2_configuration_set" "isodraw" {
  count                  = local.email ? 1 : 0
  configuration_set_name = "isodraw"
  reputation_options {
    reputation_metrics_enabled = true
  }
  suppression_options {
    suppressed_reasons = ["BOUNCE", "COMPLAINT"]
  }
  delivery_options {
    tls_policy = "REQUIRE"
  }
}

# Cognito sends as the domain when cognito_email_via_ses is on.
resource "aws_sesv2_email_identity_policy" "cognito" {
  count          = local.email ? 1 : 0
  email_identity = aws_sesv2_email_identity.isodraw[0].email_identity
  policy_name    = "cognito"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "cognito-idp.amazonaws.com" }
      Action    = ["ses:SendEmail", "ses:SendRawEmail"]
      Resource  = aws_sesv2_email_identity.isodraw[0].arn
      Condition = { StringEquals = { "aws:SourceAccount" = data.aws_caller_identity.current.account_id } }
    }]
  })
}

data "aws_caller_identity" "current" {}

# The API's sender. Fly's AWS_* variables belong to Tigris, so the API reads
# these keys as SES_ACCESS_KEY_ID and SES_SECRET_ACCESS_KEY.
resource "aws_iam_user" "mailer" {
  count = local.email ? 1 : 0
  name  = "isodraw-api-mailer"
}

resource "aws_iam_user_policy" "mailer" {
  count = local.email ? 1 : 0
  name  = "send-from-isodraw"
  user  = aws_iam_user.mailer[0].name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = ["ses:SendEmail"]
      Resource  = [aws_sesv2_email_identity.isodraw[0].arn, aws_sesv2_configuration_set.isodraw[0].arn]
      Condition = { StringEquals = { "ses:FromAddress" = var.email_from } }
    }]
  })
}

resource "aws_iam_access_key" "mailer" {
  count = local.email ? 1 : 0
  user  = aws_iam_user.mailer[0].name
}
