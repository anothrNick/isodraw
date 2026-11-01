<!-- diagram -->
## Overview

How people at Lumen Labs reach work apps without a VPN. No network is trusted. Every request is checked for **who** is asking ([@Identity provider](isodraw:node/idp)) and **from what** ([@Managed laptop](isodraw:node/laptop) health), and private apps are reachable only through the [@Access proxy](isodraw:node/proxy).

| App type | Reached through | Example |
| --- | --- | --- |
| SaaS | Single sign-on straight to the vendor | [@Email](isodraw:node/email), [@Team chat](isodraw:node/chat) |
| Private, cloud | [@Access proxy](isodraw:node/proxy) | [@Internal tools](isodraw:node/tools) |
| Private, office | Access proxy and [@App connector](isodraw:node/connector) | [@File shares](isodraw:node/files) |

## Access rules

| Who | Device | Can reach |
| --- | --- | --- |
| Employees | Managed, healthy | Everything their groups allow |
| Employees | Managed, out of date | SaaS only, until it updates |
| Contractors | Any, browser only | Named internal tools, no downloads |
| Anyone | Unknown device | Sign-in page only |

<!-- node:employee -->
About 400 employees, most of them hybrid. They sign in once in the morning; the proxy re-checks every request silently after that.

<!-- node:laptop -->
Company laptops managed by the device-management service. The device agent reports health to the [@Identity provider](isodraw:node/idp) every 15 minutes:

- disk encryption on
- OS no more than 30 days behind on updates
- endpoint protection running
- screen lock 5 minutes or less

A laptop that fails a check keeps SaaS access but loses private apps until it's fixed.

<!-- node:phone -->
The employee's phone, used for MFA. Push approvals show the app and location being signed into; number matching is required for admin roles.

<!-- node:contractors -->
Agency contractors on their own computers. They never get a device agent, so the proxy gives them browser-only access to the named tools in their contract, with copy, download and print turned off.

<!-- node:idp -->
The identity provider: one account per person, groups from HR, and the device-health signal from laptops.

| Setting | Value |
| --- | --- |
| Sign-in | Passkey or password + MFA |
| Session length | 12 hours, re-checked on every token refresh |
| Federation | SAML to SaaS, OIDC to the proxy |
| Admin roles | Phishing-resistant MFA only |

<!-- node:proxy -->
The access proxy checks every request to a private app: a valid identity token, a healthy device and a group that allows that app. Nothing behind it has a public address.

| Policy | Value |
| --- | --- |
| Token lifetime | 10 minutes |
| Re-authentication | On risk change or every 12 hours |
| Logging | Every request, to [@Security analytics](isodraw:node/siem) |

<!-- node:siem -->
Security analytics: sign-ins, proxy decisions and SaaS audit logs in one place, kept for 13 months. Alerts go to the on-call security engineer.

| Alert | Example |
| --- | --- |
| Impossible travel | Sign-ins from two countries within an hour |
| Mass download | More than 500 files from [@File shares](isodraw:node/files) in 10 minutes |
| Policy bypass | Requests to an internal app that skip the proxy |

<!-- node:saas -->
Software-as-a-service apps. Lumen doesn't run them, so access is controlled at sign-in: the identity provider is the only way in, and leavers lose access everywhere within minutes.

<!-- node:email -->
Company email and calendar, signed into with SAML. External forwarding is blocked.

<!-- node:chat -->
Team chat. Guest accounts for partners expire after 90 days.

<!-- node:code -->
Code hosting. Pushing to `main` needs a signed commit from a managed laptop, and the [@Build runners](isodraw:node/runners) are the only machines allowed to deploy.

<!-- node:gcp -->
The Google Cloud project `lumen-internal`. Its apps have no public ingress; the only way in is through the [@Access proxy](isodraw:node/proxy).

<!-- node:tools -->
Internal tools on Cloud Run: expenses, the on-call rota and the admin console. They trust the proxy's signed identity header, so none of them has its own login.

<!-- node:hrdb -->
Cloud SQL for PostgreSQL with HR records. Only [@Internal tools](isodraw:node/tools) can connect, through a private IP, and every query is logged.

<!-- node:runners -->
CI runners on GKE that run builds for [@Code hosting](isodraw:node/code). They pull jobs, so nothing needs to reach into the cluster.

<!-- node:office -->
The head office in Bristol. It still hosts the file server; nothing in the office is reachable from outside except through the [@App connector](isodraw:node/connector).

<!-- node:connector -->
A small VM that connects out to the [@Access proxy](isodraw:node/proxy) and forwards approved requests to office systems. The office firewall allows no inbound connections at all.

<!-- node:files -->
The office file server (about 6 TB), due to move to cloud storage next year. Until then, access is read-only for anyone outside the office.

<!-- edge:e4 -->
Every request to a private app goes through the proxy, which checks the identity token and device health first. It's quick: decisions are cached for the token's 10-minute lifetime.

<!-- edge:e13 -->
The connector opens an outbound tunnel to the proxy and keeps it open. Requests arrive over that tunnel, so the office needs no inbound firewall rules.
