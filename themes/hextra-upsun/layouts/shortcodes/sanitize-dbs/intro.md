<!-- shortcode start {{ .Name }} -->
{{ $db := .Get "database" }}
{{ $framework := .Get "framework" }}
Databases of live websites often contain personally identifiable information (PII)
such as full names, mailing addresses, and phone numbers.
To ensure people reviewing code changes can't access information they shouldn't,
sanitize your databases of any PII that they may contain.

{{ if $db }}
This example goes through the process for a {{ $db }} database using {{ $framework }}.
{{ end }}
<!-- shortcode end {{ .Name }} -->
