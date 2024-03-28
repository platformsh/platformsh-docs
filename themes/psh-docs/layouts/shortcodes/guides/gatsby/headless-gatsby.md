<!-- shortcode start {{ .Name }} -->
The frontend Gatsby app has a slightly different configuration from the basic [Gatsby deployment](/guides/gatsby/deploy.html).
Below is the `gatsby/.platform.app.yaml` file that configures the app.

{{ $file := printf "static/files/fetch/multiappyaml/%s" (.Get "template") }}
{{ highlight ( readFile $file ) "yaml" ""}}

In particular, notice:

- `relationships`

  Access to another service or app container in the cluster is given through [`relationships`](/create-apps/app-reference/single-runtime-image#relationships).
  In this case, one has been defined to the backend {{ .Get "name" }} container using it's `name`.

- `post_deploy`

  {{ .Site.Params.vendor.name }} containers reside in separate build containers at build time,
  before their images are moved to the final app container at deploy time.
  These build containers are isolated and so Gatsby can't access {{ .Get "name" }} during the build hook,
  where you would normally run the [`gatsby build` command](https://github.com/platformsh-templates/gatsby/blob/master/.platform.app.yaml#L21).
  {{ .Get "name" }} isn't available until after the deploy hook.
  So the Gatsby build is postponed until the [`post_deploy` hook](/create-apps/hooks/hooks-comparison.html#post-deploy-hook).

  To run `gatsby build` on-demand, or to trigger a rebuild from the backend when content is updated,
  define a [runtime operation](/create-apps/runtime-operations.html#build-your-app-when-using-a-static-site-generator).

- `mounts`

  There are consequences to postponing the Gatsby build,
  as you don't generally have write access to the container this late in the pipeline.
  To allow Gatsby to write to `public`, that directory has been defined as a [mount](/create-apps/app-reference/single-runtime-image#mounts).

{{ .Inner | .Page.RenderString }}

This is facilitated by {{ .Site.Params.vendor.name }}'s [Config Reader library](https://github.com/platformsh/config-reader-nodejs).
So be sure to install this to the Gatsby dependencies first when replicating.
When used, Gatsby pulls the information to communicate with the {{ .Get "name" }} container *on the current branch*.

{{ $file := printf "static/files/fetch/gatsby/%s" (.Get "template" ) }}
{{ highlight ( readFile $file ) "js" ""}}

Lastly, the Gatsby app itself needs to include [GraphQL queries](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/)
to handle the data coming from {{ .Get "name" }} and create content pages.
The most important files in the template you should consult are:
<!-- shortcode end {{ .Name }} -->
