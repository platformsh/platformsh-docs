<!-- shortcode start {{ .Name }} -->
When you first deploy the template, the frontend Gatsby site will fail with a 403 error.
Visit the `backend` subdomain of your site and finish the installation of {{ .Get "name"}}.
You don't need to set database credentials as they're already provided.

{{ .Inner | .Page.RenderString }}

Once you've finished, redeploy the project with the CLI command `platform redeploy` to view your Gatsby site,
It's now pulling its content from a backend {{ .Get "name" }} container in the same project.
<!-- shortcode end {{ .Name }} -->
