<!-- shortcode start {{ .Name }} -->
This file describes which [service containers](/add-services.html) (such as a database) your project should include.
Gatsby does not require services to deploy, but {{ .Get "name" }} does.
So the following examples shows these service configurations:

{{ $file := printf "static/files/fetch/servicesyaml/%s" (.Get "template") }}
{{ highlight ( readFile $file ) "yaml" ""}}
<!-- shortcode end {{ .Name }} -->
