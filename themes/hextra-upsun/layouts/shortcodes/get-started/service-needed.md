<!-- shortcode start {{ .Name }} -->
<div x-show="stack === 'php'">

You can now see your built app at the returned URL.

</div>

<div x-show="stack === 'python' | stack === 'nodejs'">

Your app is built and served at the returned URL, but it doesn't yet have all the services it needs to work.
</div>

You could [define more complicated routes](/define-routes.html),
but the default is enough for basic apps.
Now branch your environment to see how data works in {{ .Site.Params.vendor.name }}  and then add services.
<!-- shortcode end {{ .Name }} -->
