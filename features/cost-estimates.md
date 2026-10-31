# Cost estimates

**Status:** idea · **Priority:** next
**Summary:** Estimated monthly cost for each component, with totals per area and per diagram, from public cloud price lists.

## Why

It's one of Cloudcraft's most used features, and it changes the diagram from a picture into something people use in planning and review.

## How it could work

- **Pricing data:** a server job pulls AWS, GCP and Azure public price lists into a compact table (by service, size and region), refreshed weekly.
- **What's priced:** components with a known type and size: instances and their classes, databases, caches, load balancers, NAT gateways, storage with a size. The Terraform import already captures these settings; components drawn by hand get a *Pricing* section in the inspector (type, size, region, count, hours).
- **Display:** a small cost label on priced components (toggleable), totals per area, and a cost table in the docs view.
- **Assumptions are visible:** region, hours, on-demand prices, and what isn't included (data transfer, requests) are listed with the total.
