---
title: "Webhooks"
description: |
  Webhooks allow you to host a script yourself externally that receives the same payload as an activity script and responds to the same events, but can be hosted on your own server in your own language.
layout: single
---

{{% description %}}

## Setup

```bash
{{% vendor/cli %}} integration:add --type=webhook --url={{<variable "URL_TO_RECEIVE_JSON" >}}
```

The webhook URL receives a POST message for every activity that's triggered.
The message contains complete information about the entire state of the project at that time.

It's possible to set the integration to only send certain activity types, or only activities on certain branches.
The CLI prompts you to specify which to include or exclude.
Leave at the default values to get all events on all environments in a project.

For testing purposes, you can generate a URL from a service such as [webhook.site](https://webhook.site/)
and use the generated URL as `{{<variable "URL_TO_RECEIVE_JSON" >}}`.

## Authentication

You can sign webhook payloads so that your receiving application can verify they genuinely come from {{% vendor/name %}}.
To do so, provide a shared secret key when creating or updating the integration:

```bash
{{% vendor/cli %}} integration:add --type=webhook --url={{<variable "URL_TO_RECEIVE_JSON" >}} --shared-key={{<variable "SECRET_KEY" >}}
```

To update the key on an existing integration:

```bash
{{% vendor/cli %}} integration:update {{<variable "INTEGRATION_ID" >}} --shared-key={{<variable "SECRET_KEY" >}}
```

Use a long, random string as the secret key (for example, the output of `openssl rand -base64 32`).

### How it works

When a shared key is configured, every webhook request includes an `X-JWS-Signature` HTTP header
containing a [JSON Web Signature](https://datatracker.ietf.org/doc/html/rfc7515) (JWS).
The webhook body itself remains a standard JSON payload — the signature is separate.

The signature uses the following scheme:

- **Algorithm:** HS256 (HMAC-SHA256 with the shared key)
- **Format:** JWS Compact Serialization with a **detached, unencoded payload** per [RFC 7797](https://datatracker.ietf.org/doc/html/rfc7797)
- **JWS protected header:** `{"alg":"HS256","b64":false,"crit":["b64"]}`

Because the payload is detached and unencoded (`b64:false`), the `X-JWS-Signature` value has the form:

```text
<base64url-encoded-header>..<base64url-encoded-signature>
```

Note the **two dots with nothing between them** — the payload slot is empty because the payload is sent in the POST body rather than embedded in the JWS token.

### Verifying the signature

To verify a webhook request:

1. Read the raw POST body (the JSON payload).
2. Read the `X-JWS-Signature` header.
3. Parse the JWS protected header and signature from the header value (the string in the form `<base64url-encoded-header>..<base64url-encoded-signature>`). Then, do one of the following:
   - Use a JWS library that supports RFC 7797 detached, unencoded payloads (`b64:false`) and pass the raw body bytes from step 1 as the detached payload.
   - Manually compute the JWS signing input as `<base64url-encoded-header>.<raw-body-bytes>` and verify the HS256 MAC over this signing input with your shared key.
4. Verify the signature using HS256 with your shared key, treating the raw body bytes from step 1 as the payload. Do **not** try to build a new compact JWS string by inserting the raw body between the two dots.
5. If verification fails, reject the request (for example, respond with `401`).

{{% note %}}
The examples below are illustrative.
Always refer to each library's latest documentation for up-to-date API usage and security guidance.
{{% /note %}}

#### Python

The [`jwcrypto`](https://jwcrypto.readthedocs.io/) library natively supports RFC 7797 detached payloads.

```python
from jwcrypto import jws, jwk

def verify_webhook(payload: bytes, signature: str, shared_key: str) -> bool:
    """Verify a Platform.sh webhook signature.

    Args:
        payload: The raw request body.
        signature: The X-JWS-Signature header value.
        shared_key: The shared secret key configured on the integration.
    """
    key = jwk.JWK(kty="oct", k=shared_key)
    verifier = jws.JWS()
    verifier.deserialize(signature)
    verifier.verify(key, payload)
```

Install with `pip install jwcrypto`.

#### Node.js / TypeScript

The [`jose`](https://github.com/panva/jose) library supports detached payloads via `flattenedVerify` or `compactVerify`.

```javascript
import * as jose from "jose";

async function verifyWebhook(payload, signature, sharedKey) {
  // Encode the shared key
  const key = new TextEncoder().encode(sharedKey);

  // Re-attach the payload into the JWS compact token
  const [header, , sig] = signature.split(".");
  const payloadB64u = jose.base64url.encode(payload);
  const jws = `${header}.${payloadB64u}.${sig}`;

  // Verify — throws on failure
  await jose.compactVerify(jws, key);
}
```

Install with `npm install jose`.

#### PHP

The [`web-token/jwt-library`](https://web-token.spomky-labs.com/) package supports RFC 7797 unencoded payloads.

```php
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\Algorithm\HS256;
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Signature\Serializer\CompactSerializer;

function verifyWebhook(string $payload, string $signature, string $sharedKey): bool
{
    // Re-attach the payload into the JWS compact token
    $parts = explode('.', $signature);
    $jws_string = $parts[0] . '.' . base64_encode($payload) . '.' . $parts[2];

    $serializer = new CompactSerializer();
    $jws = $serializer->unserialize($jws_string);

    $key = new JWK(['kty' => 'oct', 'k' => $sharedKey]);
    $algorithm = new AlgorithmManager([new HS256()]);
    $verifier = new JWSVerifier($algorithm);

    return $verifier->verifyWithKey($jws, $key, 0);
}
```

Install with `composer require web-token/jwt-library`.

#### Go

The [`go-jose`](https://github.com/go-jose/go-jose) library can verify JWS signatures.
Since it doesn't natively handle RFC 7797 detached payloads, re-attach the payload first.

```go
package main

import (
	"encoding/base64"
	"strings"

	"github.com/go-jose/go-jose/v4"
)

func verifyWebhook(payload []byte, signature string, sharedKey string) error {
	// Re-attach payload into the compact JWS token
	parts := strings.SplitN(signature, ".", 3)
	payloadB64 := base64.RawURLEncoding.EncodeToString(payload)
	token := parts[0] + "." + payloadB64 + "." + parts[2]

	jws, err := jose.ParseSigned(token, []jose.KeyAlgorithm{jose.HS256})
	if err != nil {
		return err
	}
	_, err = jws.Verify([]byte(sharedKey))
	return err
}
```

Install with `go get github.com/go-jose/go-jose/v4`.

## Webhook schema

See the [activity script](/integrations/activity/reference.md) reference for a description of the webhook payload.

## Validate the integration

To verify your integration is functioning properly, run the following [CLI command](/integrations/overview.md#validate-integrations):

```bash
{{% vendor/cli %}} integration:validate
```
