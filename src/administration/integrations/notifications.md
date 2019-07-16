# Health Notifications

Platform.sh can notify you when various events happen on your project, in any environment.  At this time the only notification provided is a low disk space warning, but others may be added in the future.

> **Note**
>
> Remember that you must have `admin` access to a project in order to add or modify an integration.  See [User administration](/administration/users.md) for more details.

## Available notifications

### Low-disk warning

If any notifications are configured, Platform.sh will monitor disk space usage on all applications and services in your cluster.

* If and when available disk space drops below 20%, a warning notification is generated.
* If and when available disk space drops below 10%, a critical notification is generated.
* If and when available disk space goes back above 20% after previously having been lower, an all-clear notification is generated.

Notifications are generated every 5 minutes, so there may be a brief delay between when the threshold is crossed and when the notification is triggered.

## Configuring notifications

Health notifications can be set up via the [Platform.sh CLI](/gettingstarted/cli.html), through a number of different channels.

### Email notifications

A notification can trigger an email to be sent, from an address of your choosing to one or more addresses of your choosing.

To do so, register a `health.email` integration as follows:

```bash
platform integration:add --type health.email --from-address you@example.com --recipients them@example.com --recipients others@example.com
```

The `from-address` is whatever address you want the email to appear to be from.  You must specify one or more `recipients`, each as its own switch.  It is completely fine to use the same address for both `from-address` and `recipients`.

### Slack notifications

A notification can trigger a message to be sent to a Slack bot.  First, create a new custom "[bot user](https://api.slack.com/bot-users)" for your Slack group and configure the channels you wish it to live in.  Note the API token is the "Bot User OAuth Access Token" provided by Slack.

Then register that Slack bot with Platform.sh using a `health.slack` integration:

```bash
platform integration:add --type health.slack --token YOUR_API_TOKEN --channel '#channelname'
```

That will trigger the corresponding bot to post a notification to the `#channelname` channel in your Slack group.

### PagerDuty notifications

A notification can trigger a message to be sent via PagerDuty, if you are using that service.  First, create a new PagerDuty "[integration](https://support.pagerduty.com/docs/services-and-integrations)" that uses the Events API v2.  Copy the "Integration Key" as known as the "routing key" for the integration.

Now register a `health.pagerduty` integration as follows:


```bash
platform integration:add --type health.pagerduty --routing-key YOUR_ROUTING_KEY
```

Any notification will now trigger an alert in PagerDuty.

### Webhooks notifications

A notification can trigger a message to be sent to a web endpoint.

To do so, register a `health.webhook` integration as follows:

```bash
platform integration:add --type health.webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON
```

Any notification will now be posted to the `health.webhook` URL.

In order to let you verify that requests are coming from the integration, you can use the optional `shared-key` parameter which will add a `X-JWS-Signature` request header containing the JSON Web Token Signature in JWS Compact Serialization with Unencoded Detached Payload ([RFC7797](https://tools.ietf.org/html/rfc7797)).

```bash
platform integration:add --type health.webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON --shared-key JWS-SYMMETRIC-KEY
```

The signature is calculated using the given `shared-key` and the fixed header:

```json
{"alg":"HS256","b64":false,"crit":["b64"]}
```

A simplified example payload with the corresponding signature using `shared-key := 'secret'` may look like the following snippet:

```json
POST /health/notifications HTTP/1.0
Host: www.example.com
Content-Length: 1495
Content-Type: application/json
X-JWS-Signature: eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..fYW9qrjShmEArV17Z1kH6yudoXzpBE3PzJXq_OqrIfM

{"project": {"id": "test_project", "created_at": "2014-02-19T10:33:24.220090+00:00", "updated_at": "2019-07-16T23:13:08.714765+00:00", "attributes": {}, "title": "Test project", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit", "region": "admin.local.c-g.io", "subscription": {"license_uri": "http://admin.local.c-g.io/_", "plan": "standard", "environments": 10, "storage": 5120, "included_users": 3, "subscription_management_uri": "http://subscription-management", "restricted": true, "suspended": false, "user_licenses": 1}, "repository": {"url": "test_project@git.local.c-g.io/test_project.git", "client_ssh_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDKaBW95l6J3sWZROA4T+pl9Fv4gHUIHtW0R+yqOH/4qzOlWOxUmg5r4V6xHPVmCA+RuXjzmsTy0cJHDVxjxtkjB6g8PXp9G86P9MiZYPWuolpSR/2+ix7mo2zuJEsZQbfGoOaZKQgGvdWNHZusJCy8Ay53CkBMVmlXB+f9Q0U3C1iO/R3EJxdwEBFTx97xzAaBn8hBH1W3SEID/hBlVJiImuGi7CccAtNfyvAaA+VlgSwsX9DDsKFSCHe9q7xckrN0CSp9A/XnA/UyiSiplefjTr0dIb/Xf/aqcML1WomnggopBFk06LkMg31xLiACvlqMArSLd9BP34IanW3oKWjn test_project@platformsh"}, "owner": "alice", "default_domain": null, "status": {"code": "provisioned", "message": "ok"}}, "event": {"time": "2019-07-16T23:13:12.099235+00:00", "origin": {"project": "test_project", "environment": "master-7rqtwti", "service": "mysql", "instance": "0"}, "component": "disk", "subcomponent": "persistent", "severity": "warning", "message": "less than 214.748 MB available", "metrics": {"total:byte": 1073741824, "available:byte": 134217728}}}
```

Signature verification is a simple 2 step process:

```python
# 1. Compute JWS Compact Serialization with Unencoded Detached Payload

from jwcrypto import jws, jwk

rfc7797_u_header = '{"alg":"HS256","b64":false,"crit":["b64"]}'
json_web_key = jwk.JWK(kty="oct", k="JWS-SYMMETRIC-KEY")

sig = jws.JWS(request.body())
sig.add_signature(json_web_key, protected=rfc7797_u_header)
sig.detach_payload()

# 2. Verify the signature

assert sig.serialize(compact=True) == request.headers["X-JWS-Signature"]
```

Please refer to the [JOSE Cookbook](https://github.com/ietf-jose/cookbook) for examples about protecting content using JavaScript Object Signing and Encryption (JOSE).
