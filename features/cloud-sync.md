# Live cloud sync

**Status:** idea · **Priority:** later
**Summary:** Build and refresh diagrams from what's actually running in AWS, Google Cloud and Azure, with read-only access, and show drift from Terraform.

## How it could work

- **Access, without stored keys:** an AWS IAM role trusted by our account with a per-workspace external ID; a GCP service account with Cloud Asset viewer; an Azure app with Reader. One-click onboarding templates for each.
- **Inventory:** GCP Cloud Asset Inventory and Azure Resource Graph list everything in one call each. AWS has no single source: AWS Config when it's on, otherwise per-service calls across regions.
- **One model:** every source converts into a common resource model, keyed by cloud id (ARN, self link, Azure id), so the existing catalog, linking and layout work for all of them.
- **Scope:** a diagram covers a scope (a VPC, a tag like `app=shop`, a resource group, a project), not a whole account.
- **Sync:** scheduled or on demand; changes merge into the diagram with review, like Terraform re-import.
- **Drift:** compare Terraform state with what's running and highlight differences.

## Risks

Security reviews will look closely: least-privilege policies, published permissions, external ids, no secrets stored from resource attributes.
