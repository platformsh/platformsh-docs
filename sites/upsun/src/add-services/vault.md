---
title: Vault key management service
sidebarTitle: Vault KMS
weight: 50
---

The Vault key management service (KMS) provides key management and access control for your secrets.
The {{% vendor/name %}} Vault KMS offers the [transit secrets engine](https://developer.hashicorp.com/vault/docs/secrets/transit)
to sign, verify, encrypt, decrypt, and rewrap information.

Vault doesn't store the data sent to the transit secrets engine,
so it can be viewed as encryption as a service.
To store secrets such as API keys, create sensitive [environment variables](../development/variables/_index.md).

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="vault-kms" status="supported" environment="grid" >}}

## Relationship reference


For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} automatically generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [``PLATFORM_RELATIONSHIPS`` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``upsun ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

```bash
VAULT_USERNAME=
VAULT_SCHEME=http
VAULT_SERVICE=vault-kms
VAULT_FRAGMENT=
VAULT_IP=123.456.78.90
VAULT_INSTANCE_IPS=['123.456.78.90']
VAULT_HOSTNAME=azertyuiopqsdfghjklm.vault-kms.service._.eu-1.{{< vendor/urlraw "hostname" >}}
VAULT_PORT=8200
VAULT_CLUSTER=azertyuiopqsdf-main-afdwftq
VAULT_HOST=vault_secret.internal
VAULT_REL=manage_keys
VAULT_PATH=/
VAULT_QUERY={'is_master': True}
VAULT_PASSWORD=ChangeMe
VAULT_EPOCH=0
VAULT_TYPE=vault-kms:{{% latest "vault-kms" %}}
VAULT_PUBLIC=false
VAULT_HOST_MAPPED=false
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
    "username": "",
    "scheme": "http",
    "service": "vault-kms",
    "fragment": "",
    "ip": "123.456.78.90",
    "instance_ips": [
      "123.456.78.90"
    ],
    "hostname": "azertyuiopqsdfghjklm.vault-kms.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "port": 8200,
    "cluster": "azertyuiopqsdf-main-7rqtwti",
    "host": "vault_secret.internal",
    "rel": "sign",
    "path": "\/",
    "query": {
        "is_master": true
    },
    "password": "ChangeMe",
    "type": "vault-kms:{{% latest "vault-kms" %}}",
    "public": false,
    "host_mapped": false
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_VAULT_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.vault_secret[0].host')"
```

{{< /codetabs >}}

## Usage example

### 1. Configure the service

To define the service, use the `vault-kms` type:

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: vault-kms:<VERSION>
        configuration:
            endpoints:
                <ENDPOINT_ID>:
                    - policy: <POLICY>
                      key: <KEY_NAME>
                      type: <ENDPOINT_TYPE>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

- {{< variable "SERVICE_NAME" >}} is the name you choose to identify the service.
- {{< variable "VERSION" >}} is a supported version of the service.
- {{< variable "ENDPOINT_ID" >}} is an identifier you choose for the endpoint.
- {{< variable "KEY_NAME" >}} is the name of the key to be stored in the Vault KMS.
- {{< variable "POLICY" >}} is one of the available [policies](#policies) based on what you want to accomplish.
- The `type` is one of:

  - `sign`: for signing payloads, with the type `ecdsa-p256`
  - `encrypt` (for encrypt`chacha20-poly1305`).

  The `type` can't be changed after creation.

You can create multiple endpoints, such as to have key management separate from key use.

512 MB is the minimum required disk space for the Vault KMS service.

### 2. Define the relationship

To define the relationship, use the following configuration:

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>:
                service: <SERVICE_NAME>
                endpoint: <ENDPOINT_ID>
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: vault-kms:<VERSION>
        configuration:
            endpoints:
                <ENDPOINT_ID>:
                    - policy: <POLICY>
                      key: <KEY_NAME>
                      type: <ENDPOINT_TYPE>
```

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container (``<APP_NAME>``) now has access to the service via the relationship ``<RELATIONSHIP_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

If you split the service into multiple endpoints, define multiple relationships.

### Example configuration

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    relationships:
      vault_secret: "vault-kms:manage_keys"

services:
  # The name of the service container. Must be unique within a project.
  vault-kms:
    type: vault-kms:1.12
    configuration:
      endpoints:
        manage_keys:
          - policy: admin
            key: vault-sign
            type: sign
          - policy: sign
            key: vault-sign
            type: sign
          - policy: verify
            key: vault-sign
            type: sign
```

## Multiple endpoints example

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
   relationships:
      vault_manage:
        service: vault-kms
        endpoint: management
      vault_sign:
        service: vault-kms
        endpoint: sign_and_verify

services:
  # The name of the service container. Must be unique within a project.
  vault-kms:
    type: vault-kms:1.12
    configuration:
      endpoints:
        management:
          - policy: admin
            key: admin-key
            type: sign
        sign_and_verify:
          - policy: sign
            key: signing-key
            type: sign
          - policy: verify
            key: signing-key
            type: sign
```

## Use Vault KMS

To connect your app to the Vault KMS, use a token that's defined in the [service environment variables](#relationship-reference).
With this token for authentication,
you can use any of the policies you [defined in your `{{< vendor/configfile "services" >}}` file](#1-configure-the-service).

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

The following examples use cURL as an example, which you could do in a hook or after accessing your app with SSH.
Adapt the examples for your app's language.

### Get the token

To make any calls to the Vault KMS, you need your token. Get it from the [service environment variables](#relationship-reference):

```bash
echo ${{{< variable "RELATIONSHIP_NAME" >}}_PASSWORD}"
```

`{{< variable "RELATIONSHIP_NAME" >}}` is the relationship name you [defined in your `{{< vendor/configfile "app" >}}` file](#2-define-the-relationship).

You can also store this as a variable:

```bash
VAULT_TOKEN=${{{< variable "RELATIONSHIP_NAME" >}}_PASSWORD}
```

A given token is valid for one year from its creation.

### Get the right URL

The [service environment variable](#relationship-reference) also contains the information you need to construct a URL for contacting the Vault KMS: the `host` and `port`.

Assign it to a variable as follows:

```bash
VAULT_URL=${{{< variable "RELATIONSHIP_NAME" >}}_HOST}:${{{< variable "RELATIONSHIP_NAME" >}}_PORT}
```

`{{< variable "RELATIONSHIP_NAME" >}}` is the name you [defined in your `{{< vendor/configfile "app" >}}` file](#2-define-the-relationship).

### Manage your keys

Your key names are [defined in your `{{< vendor/configfile "services" >}}` file](#1-configure-the-service). You can manage them if you've set an [admin policy](#policies) for them.

To get information on a key, such as its expiration date, run the following command:

```bash
curl \
  --header "X-Vault-Token: $VAULT_TOKEN" \
  http://"$VAULT_URL"/v1/transit/keys/"$KEY_NAME" | jq .
```

`$KEY_NAME` is the name in your `{{< vendor/configfile "services" >}}` file.

To rotate the version of your key, run the following command:

```bash
curl \
  --header "X-Vault-Token: $VAULT_TOKEN" \
  http://"$VAULT_URL"/v1/transit/keys/"$KEY_NAME">/rotate \
  --request POST
```

### Sign and verify payloads

If you've set [sign and verify policies](#policies), you can use your keys to sign and verify various payloads, such as a JSON Web Token (JWT) for authentication in your app. Note that all payloads (all plaintext data) must be base64-encoded.

To sign a specific payload, run the following command:

```bash
curl \
  --header "X-Vault-Token: $VAULT_TOKEN" \
  http://$VAULT_URL/v1/transit/sign/"$KEY_NAME"/sha2-512 \
  --data "{\"input\": \"$(echo SECRET | base64)\"}"
```

The string at the end of the URL denotes the specific [hash algorithm used by the Vault KMS](https://www.vaultproject.io/api-docs/secret/transit#hash_algorithm).

You get back a JSON object that includes the signature for the payload:

```json
{
  "request_id": "a58b549f-1356-4028-d191-4c9cd585ca25",
  ...
  "data": {
    "key_version": 1,
    "signature": "vault-kms:v1:MEUCIAiN4UtXh..."
  },
  ...
}
```

You can then use `data.signature` to sign things such as a JWT.

To verify a payload, run the following command:

```bash
curl \
  --header "X-Vault-Token: $VAULT_TOKEN" \
  http://"$VAULT_URL"/v1/transit/verify/"$KEY_NAME"/sha2-512 \
  --data "
{
  \"input\": \"$(echo SECRET | base64)\",
  \"signature\": \"$SIGNATURE\"
}"
```

You get back a JSON object that includes whether or not the signature is valid:

```json
{
  "request_id": "5b624718-fd9d-37f6-8b95-b387379d2648",
  ...
  "data": {
    "valid": true
  },
  ...
}
```

A `true` value means the signature matches and a `false` value means it doesn't.

### Encrypt and decrypt data

If you've set [encrypt and decrypt policies](#policies), you can use your keys to encrypt and decrypt any data you want. Note that all of plaintext data you work with must be base64-encoded.

To sign a specific payload, run the following command:

```bash
curl \
  --header "X-Vault-Token: $VAULT_TOKEN" \
  http://$VAULT_URL/v1/transit/encrypt/"$KEY_NAME" \
  --data "{\"plaintext\": \"$(echo SECRET | base64)\"}"
```

You get back a JSON object that includes your encrypted data:

```json
{
  "request_id": "690d634a-a4fb-bdd6-9947-e895578b79d5",
  ...
  "data": {
    "ciphertext": "vault-kms:v1:LEtOWSwh3N...",
    "key_version": 1
  },
  ...
}
```

To decrypt data that you've already encrypted, run the following command:

```bash
curl \
  --header "X-Vault-Token: $VAULT_TOKEN" \
  http://"$VAULT_URL"/v1/transit/decrypt/"$KEY_NAME" \
  --data "
{
  \"ciphertext\": \"$CIPHERTEXT\"
}"
```

You get back a JSON object that your decrypted data base64-encoded:

```json
{
  "request_id": "bbd411ca-6ed7-aa8b-8177-0f35055ce613",
  ...
  "data": {
    "plaintext": "U0VDUkVUCg=="
  },
  ...
}
```

To get the value un-encoded, add `| jq -r ".data.plaintext" | base64 -d` to the end of the `curl` command.

#### Rewrap encrypted data

If you have already encrypted data and you have [changed your key version](#manage-your-keys), you can rewrap the encrypted data with the new key.

Assuming `$CIPHERTEXT` stores your encrypted data (`vault:v1:LEtOWSwh3N...`), run the following command:

```bash
curl \
  --header "X-Vault-Token: $VAULT_TOKEN" \
  http://"$VAULT_URL"/v1/transit/rewrap/"$KEY_NAME" \
  --data "
{
  \"ciphertext\": \"$CIPHERTEXT\"
}"
```

In the JSON object that's returned, you can notice that the `ciphertext` is different (and now includes the new key version as a prefix) as is the `key_version`:
```json
{
  ...
  "data": {
    "ciphertext": "vault-kms:v2:ICRi0yAlH...",
    "key_version": 2
  },
  ...
}
```

## Policies

| Policy    | Endpoint | Capabilities | Purpose |
| --------- | -------- | ------------ | ------- |
| `admin`   | `transit/keys/${KEY}` | `read` | Access to key properties and various functions performed on keys such as rotation and deletion |
|           | `transit/keys/${KEY}/*` | `read`, `create`, `update`, `delete` | |
| `sign`    | `transit/sign/${KEY}/${HASH_ALGORITHM}` | `read`, `update` | Signing payloads with an existing key |
| `verify`  | `transit/verify/${KEY}/${HASH_ALGORITHM}` | `read`, `update` | Verifying already signed payloads |
| `encrypt` | `transit/encrypt/${KEY}` | `read`, `update` | Encrypting data with an existing key |
| `decrypt` | `transit/decrypt/${KEY}` | `read`, `update` | Decrypting data with an existing key |
| `rewrap`  | `transit/rewrap/${KEY}` | `read`, `update` | Re-encrypting data with a new key version without revealing the secret |
