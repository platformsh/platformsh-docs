<!-- shortcode start {{ .Name }} -->
## Project isolation

All Dedicated clusters are single-tenant.
The [three hosts](./_index.md) are exclusively used by a single customer
and each cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers).

{{ $plan := .Get "plan" }}
{{ if eq $plan "true" }}
The network is behind a firewall for incoming connections.
Only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS) are opened to incoming traffic.
{{ else }}
The network is behind a firewall for incoming connections.
Only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS), and 2221 (SFTP) are opened to incoming traffic.
{{ end }}

**There are no exceptions** for this rule, so any incoming web service requests,
ETL jobs, or otherwise need to transact over one of these protocols.

Outgoing TCP traffic isn't behind a firewall.
Outgoing UDP traffic is disallowed.

For containers to be allowed to connect to each other, the following requirement must be met:

- The containers must live in the same environment.
- You need to define an explicit `relationship` between the containers
  in your [app configuration](/create-apps/app-reference/single-runtime-image.md#relationships).
<!-- shortcode end {{ .Name }} -->
