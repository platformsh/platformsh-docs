<!-- shortcode start {{ .Name }} -->
Gatsby supports pulling multiple sources into its build.
This includes external services like Stripe and additional backend CMSs for different sets of content.
As in this example with {{ .Get "name" }},
you can branch off your repository and add an additional directory that contains the codebase for [another backend](/guides/gatsby/headless.html#headless-backends).
Then add the source plugin for that backend to `gatsby-config.js`.
<!-- shortcode end {{ .Name }} -->
