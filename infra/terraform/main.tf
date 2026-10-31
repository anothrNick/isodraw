# Sign-in for IsoDraw: a Cognito user pool (new, or an existing one) and an
# app client for the API's OIDC code flow. The API only speaks standard OIDC,
# so these outputs become its OIDC_* settings.

locals {
  create_pool = var.existing_user_pool_id == ""
  pool_id     = local.create_pool ? aws_cognito_user_pool.isodraw[0].id : var.existing_user_pool_id
  app_url     = trimsuffix(var.app_url, "/")
}

resource "aws_cognito_user_pool" "isodraw" {
  count = local.create_pool ? 1 : 0
  name  = "isodraw"

  # People sign in with their email address, verified by Cognito.
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  password_policy {
    minimum_length    = 10
    require_lowercase = true
    require_uppercase = false
    require_numbers   = true
    require_symbols   = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    mutable             = true
    required            = false
    string_attribute_constraints {
      min_length = 0
      max_length = 200
    }
  }

  deletion_protection = "ACTIVE"
}

resource "aws_cognito_user_pool_domain" "isodraw" {
  count        = local.create_pool ? 1 : 0
  domain       = var.domain_prefix
  user_pool_id = aws_cognito_user_pool.isodraw[0].id
}

resource "aws_cognito_user_pool_client" "isodraw" {
  name         = "isodraw"
  user_pool_id = local.pool_id

  # A confidential client: the API exchanges the code with this secret, plus PKCE.
  generate_secret                      = true
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]
  supported_identity_providers         = ["COGNITO"]
  callback_urls                        = concat(["${local.app_url}/auth/callback"], var.extra_callback_urls)
  logout_urls                          = [local.app_url]

  explicit_auth_flows           = ["ALLOW_REFRESH_TOKEN_AUTH"]
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation       = true

  # The API keeps its own session; Cognito tokens are only used at sign-in.
  id_token_validity      = 60
  access_token_validity  = 60
  refresh_token_validity = 30
  token_validity_units {
    id_token      = "minutes"
    access_token  = "minutes"
    refresh_token = "days"
  }
}
