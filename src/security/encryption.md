# Encryption

## Data in Transit

Data in transit between the World and Platform.sh is always encrypted as all of the sites and tools which Platform.sh supports and maintains require TLS or SSH to access. This includes the Platform.sh management console, Accounts site, Git repositories, Documentation, and Helpdesk.

Data in transit between the World and customer applications is encrypted by default.  Only SSH and HTTPS connections are generally accepted, with HTTP request redirected to HTTPS.  Users may opt-out of that redirect and accept HTTP requests via `routes.yaml` configuration, although that is not recommended.  By default HTTPS connections use an automatically generated Let's Encrypt certificate or users may provide their own TLS certificate.

Data in transit on Platform.sh controlled networks (eg. between the application and a database) may or may not be encrypted, but is nonetheless protected by private networking rules.

## Data at Rest

All application data is encrypted at rest by default using encrypted ephemeral storage (typically using an AES-256 block cipher). Some specific setups on certain dedicated enterprise clusters do not have full encryption at rest.

If you have specific audit requirements surrounding data at rest encryption please [contact us](https://docs.platform.sh/overview/getting-help.html).
