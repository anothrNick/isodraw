output "oidc_issuer" {
  description = "OIDC_ISSUER for the API."
  value       = "https://cognito-idp.${var.region}.amazonaws.com/${local.pool_id}"
}

output "oidc_client_id" {
  description = "OIDC_CLIENT_ID for the API."
  value       = aws_cognito_user_pool_client.isodraw.id
}

output "oidc_client_secret" {
  description = "OIDC_CLIENT_SECRET for the API. Read with: terraform output -raw oidc_client_secret"
  value       = aws_cognito_user_pool_client.isodraw.client_secret
  sensitive   = true
}

output "hosted_signin_domain" {
  description = "The Cognito hosted sign-in page (only when this config created the pool)."
  value       = local.create_pool ? "https://${var.domain_prefix}.auth.${var.region}.amazoncognito.com" : "the existing pool's domain"
}

output "admin_group" {
  description = "Cognito group whose members are IsoDraw platform admins (the API's ADMIN_GROUP)."
  value       = aws_cognito_user_group.admins.name
}

output "dns_records" {
  description = "Records to add at the DNS host for email_domain (DNS only, not proxied). Cloudflare names are relative to the zone."
  value = local.email ? concat(
    [for t in aws_sesv2_email_identity.isodraw[0].dkim_signing_attributes[0].tokens : {
      type = "CNAME", name = "${t}._domainkey.${var.email_domain}", value = "${t}.dkim.amazonses.com", priority = null
    }],
    [
      { type = "MX", name = local.mail_from, value = "feedback-smtp.${var.region}.amazonses.com", priority = 10 },
      { type = "TXT", name = local.mail_from, value = "v=spf1 include:amazonses.com ~all", priority = null },
      { type = "TXT", name = "_dmarc.${var.email_domain}", value = "v=DMARC1; p=none; adkim=s; aspf=r", priority = null },
    ],
  ) : []
}

output "ses_access_key_id" {
  description = "SES_ACCESS_KEY_ID for the API."
  value       = local.email ? aws_iam_access_key.mailer[0].id : ""
}

output "ses_secret_access_key" {
  description = "SES_SECRET_ACCESS_KEY for the API. Read with: terraform output -raw ses_secret_access_key"
  value       = local.email ? aws_iam_access_key.mailer[0].secret : ""
  sensitive   = true
}

output "email_from" {
  description = "EMAIL_FROM for the API."
  value       = local.email ? local.from_header : ""
}
