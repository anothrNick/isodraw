variable "region" {
  description = "AWS region for Cognito."
  type        = string
  default     = "us-east-1"
}

variable "app_url" {
  description = "Where people reach IsoDraw (the Cloudflare Pages site), e.g. https://isodraw.example.com. Sign-in returns to <app_url>/auth/callback."
  type        = string
}

variable "extra_callback_urls" {
  description = "More sign-in return addresses, e.g. a Pages preview URL."
  type        = list(string)
  default     = []
}

variable "existing_user_pool_id" {
  description = "Reuse an existing user pool (for one account across products). Leave empty to create a pool for IsoDraw."
  type        = string
  default     = ""
}

variable "domain_prefix" {
  description = "Prefix for the Cognito hosted sign-in domain (<prefix>.auth.<region>.amazoncognito.com) when creating a pool. Must be globally unique."
  type        = string
  default     = "isodraw"
}
