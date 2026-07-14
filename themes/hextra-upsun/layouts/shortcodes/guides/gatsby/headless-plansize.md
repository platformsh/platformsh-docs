<!-- shortcode start {{ .Name }} -->
As mentioned previously, you should have at least a {{ partial "plans/multiapp-plan-name" }} plan for your multi-app projects.
This size gives the project enough resources for all of your containers
as well as the memory necessary to actually pull content from {{ .Get "name" }} into Gatsby during its build.

Keep in mind that the increased plan size applies only to your production environment,
and not to preview environments (which default to {{ partial "plans/default-dev-env-size" }}).
As you continue to work with Gatsby and a backend headless CMS,
you may want to [upsize your preview environments](/administration/pricing.html#preview-environments).
<!-- shortcode end {{ .Name }} -->
