<!-- shortcode start {{ .Name }} -->
{{ $type := .Get "type" }}
You can decrease the size of an existing disk for a{{ if eq $type "app" }}n{{end}} {{ $type }}.
If you do so, be aware that:

- You need to [create new backups](/environments/backup.md) that the downsized disk can accommodate.
  Backups from before the downsize cannot be restored unless you increase the disk size again.
- The downsize fails if there's more data on the disk than the desired size.
<!-- shortcode end {{ .Name }} -->
