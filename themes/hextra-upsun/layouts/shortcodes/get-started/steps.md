<ol>
{{ range .Page.Pages }}
<li>
    <a href="{{ .RelPermalink }}">{{ .Title }}</a>
</li>
{{ end }}
</ol>