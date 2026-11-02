<!-- diagram -->
## Overview

How a person signs in to **Tablebook** with an outside identity provider, using OAuth's authorization code flow with PKCE. Read it top to bottom: each arrow is one message, in order.

## Drawing a sequence diagram in IsoDraw

This is an ordinary diagram in the flat view. Nothing here is special; it's the same shapes and connections as any other diagram:

| Part | Made with |
| --- | --- |
| Participants | Icons along the top |
| Lifelines | A narrow **Area** under each one, with a dashed border |
| Activation bars | Thin **Blocks** on a lifeline, from the call that wakes it to its return |
| Messages | **Straight** connections; drag each end to the same height on both lifelines |
| Returns | Connections with a **dashed** line and an **open** arrowhead |
| Self calls | A connection with two bend points, into a small nested bar |
| Notes | A small tinted **Area** with a label |

Every component and message can have its own doc, like this one: select an arrow to read why that step happens.

<!-- edge:m3 -->
The API makes a random **code verifier**, keeps it in a short-lived cookie, and sends the browser to the identity provider with only its hash, the **code challenge**.

<!-- edge:m5 -->
Password and second factor are checked entirely at the identity provider. Tablebook never sees the password.

<!-- edge:m8 -->
The exchange that makes PKCE work: the identity provider hashes the verifier and compares it with the challenge it saw in step 4. A stolen code is useless without the verifier, which never left the API.

<!-- edge:m12 -->
The session cookie is `HttpOnly`, `Secure` and `SameSite=Lax`, so page scripts can't read it and other sites can't send it.

<!-- node:db -->
Postgres. One row per person in `users`, and one per signed-in device in `sessions`, holding only a hash of the session token.

<!-- node:user -->
Someone signing in to Tablebook on the web.

<!-- node:browser -->
The Tablebook web app. It never handles the password or the tokens; it only follows redirects and keeps the session cookie.

<!-- node:api -->
Tablebook's API. It starts the sign-in, swaps the code for tokens, and creates the session.

<!-- node:idp -->
The identity provider (Cognito, Okta, Google…). It owns passwords and second factors, and issues the ID token.

<!-- node:note -->
Why PKCE: even if the code leaks (logs, browser history, a malicious app on the device), only the API that holds the verifier can exchange it.
