{{ $type := .Get "type" }}
You can decrease the size of an existing disk for a{{ if eq $type "app" }}n{{end}} {{ $type }}.
If you do so, be aware that:

- Backups from before the downsize are incompatible and can no longer be used.
  You need to [create new backups](/environments/backup.md).
- The downsize fails if there's more data on the disk than the desired size.
