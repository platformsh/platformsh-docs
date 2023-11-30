<!-- shortcode start {{ .Name }} -->
## Assumptions

This example makes some assumptions, which you may need to adjust for your own circumstances.

It's assumed you want to run a built-in lightweight development server with `manage.py runserver`.
To match a production web server (such as Gunicorn or Daphne),
[modify those commands accordingly](../../../languages/python/server.md).

It's generally assumed that {{ .Site.Params.vendor.name }} is the primary remote for the project.
If you use a source integration, the steps are identical in most cases.
When they differ, the alternative is noted.
<!-- shortcode end {{ .Name }} -->
