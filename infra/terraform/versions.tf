terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.80"
    }
  }
  # State is local by default. For a shared setup, configure a backend, e.g.:
  # backend "s3" { bucket = "…" key = "isodraw/cognito.tfstate" region = "us-east-1" }
}

provider "aws" {
  region = var.region
}
