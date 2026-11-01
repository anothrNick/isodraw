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
