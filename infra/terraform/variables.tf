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

variable "email_domain" {
  description = "Domain IsoDraw sends email from through Amazon SES, e.g. isodraw.example.com. Leave empty to skip SES (Cognito then sends its own codes, at most 50 a day)."
  type        = string
  default     = ""
}

variable "email_from" {
  description = "The address emails come from, on email_domain, e.g. hello@isodraw.example.com."
  type        = string
  default     = ""
}

variable "email_from_name" {
  description = "The name shown with email_from."
  type        = string
  default     = "IsoDraw"
}

variable "cognito_email_via_ses" {
  description = "Send Cognito's verification and reset codes through SES from email_from. Turn on only once SES has production access, or codes reach verified addresses only."
  type        = bool
  default     = false
}
