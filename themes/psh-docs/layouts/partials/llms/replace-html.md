{{- $full := .full | default (0) -}}
{{- $level := .level | default (1) -}}
{{- $baseURL := .vendor.urls.docs -}}
{{- if .title -}}
  {{- if eq .version "2" }}
{{ range $num := (seq $level) }}#{{ end }} {{ .title | replaceRE `\{\{[%\|\<]?\ *vendor\/name\ *[\%|\>]?\}\}` "Upsun" }}
  {{- else -}}
{{- range $num := (seq $level) }}#{{ end }} {{ .title | replaceRE `\{\{[%\|\<]?\ *vendor\/name\ *[\%|\>]?\}\}` "Platform.sh" -}}
{{- end -}}
{{- end }}
{{- $level := .level -}}
{{- $hashes := "" -}}
{{- range seq 1 $level -}}
  {{- $hashes = printf "%s#" $hashes -}}
{{- end }}
{{ $content := .content
| replaceRE `<svg(.*?)>(<title(.*)?>)?(.*?)(<\/title>)?\n*(.*?)<\/svg>` ""
| replaceRE `<a href=\"([^\"]+)\".*?>\s*([^<\n\r]+)\s*.*?<\/a>` `[$2]($1)`
| replaceRE `<var[^>]*>([^<]+)</var>` "<$1>"
-}}

{{- $content = $content
  | replaceRE `(?s)<img[^>]*?src="([^"]*?)"[^>]*?alt="([^"]*?)"[^>]*?>` "![$2]($1)"
  | replaceRE `\[([^\]]+)\]\((\.\.?/[^)]+|/[^)]+)\)` (printf "[$1](%s$2)" $baseURL)
| replaceRE `(\[.*?\]\(https?:\/\/.*?)(\.html)(#?\S*?\))` `${1}.md${3}`
-}}

{{- $content = $content | replaceRE `(?s)<li[^>]*?>\s*<a[^>]*?>(.*?)<\/a>\s*<\/li>\s*<div[^>]*?>\s*(<div[^>]*?>.*?<\/div>)` "### $1\n$2" -}}

{{- $content = $content
 | replaceRE `(?s)(<!-- shortcode start note -->).*?<h3 class=\".*?\">(.*?)</h3>` "${1}**${2}**: \n\n"
 | replaceRE `(?s)(<!-- shortcode start note -->.*?)(<p>(.*?)</p>)(.*?<!-- shortcode end note -->)` "${1}${3}\n\n${4}"
 | replaceRE `(?s)(<!-- shortcode start note -->.*?)(</div>)(.*?<!-- shortcode end note -->)` "${1}${3}"
 | replaceRE `<!-- shortcode end note -->` ""
-}}

{{- $content = $content | replaceRE `(?s)<code>(.*?)<\/code>` "``$1``" -}}
{{- $content = $content | replaceRE `(?s)(<div class=\"bg-stone .*?text-base relative\">\s*<span class=\"relative z-10\">(.*?)<\/span>.*?<\/div>\s*<div class=\"highlight\"><pre .*?>)<code class=\"language-[^\"]+\" data-lang=\"([^\"]+)\">` `<code class="language" data-lang="$3" location="$2">` -}}
{{- $content = $content | replaceRE `(?s)<code class=\"language(-[^\"]+)?\" data-lang=\"([^\"]+)\" ?(location=\"[^\"]+\")?>(.+?)</code>` "```$2 {$3}\n$4\n```\n" -}}

{{- $content = $content
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\) ` `$1.md$4) `
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\)\n` "$1.md$4)\n"
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\)\.` `$1.md$4).`
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\),` `$1.md$4),`
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\)\*` `$1.md$4)*`
| replaceRE `(?s)<div[^>]*x-data=[^>]*>.*?</div>` ""
| replaceRE `(<style>[][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)#\&\n\ -]+<\/style>)` ``
| replaceRE `<(pre|var|span|div|a).*?>` ``
| replaceRE `<\/(pre|var|span|div|a|li)>` ``
| replaceRE `(?i)<\/?p\s*>` ``

| replaceRE `(?s)<a[^>]*?>(.*?)<\/a>` "### $1"

| replaceRE `<img\ ?\/?>` ``
| replaceRE `<h3\b[^>]*>\n*\ *(.*)\n*\ *<\/h3>` "\n\n### $1\n"
| replaceRE `<h4\b[^>]*>\n*\ *(.*)\n*\ *<\/h4>` "\n\n#### $1"
| replaceRE `<\/br>` " "

| replaceRE `\ *(<thead>)?(\n|\ )*<tr>(\n|\ )*<th>` "\n| <th>"
| replaceRE `((\|)?.*<th>(.*)?<\/th>(\n|\ )*)` `$2 $3 |`
| replaceRE `\ *(\n|\ )*<tr>(\n|\ )*<td>\n*\ *` "\n| <td>"
| replaceRE `((\|)?.*<td>(.*)?<\/td>(\n|\ )*)` `$2 $3 |`
| replaceRE `\n\ *<\/?(tbody|thead|table)>` ``
| replaceRE `\ *<\/?(tr)>` ``

| replaceRE `<strong>` "**"
| replaceRE `<\/strong>` "**"
| replaceRE `\n*<path\b[^>]*>(.*?)<\/path>\n*` ""
| replaceRE `\n*\ *<\/?(g|path)>` ""
| replaceRE `<details>\n` ""
| replaceRE `<\/details>\n` ""
| replaceRE `\ *<summary>(<b>|\*\*)?([][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)\&↗\ -]+)(<\/b>|\*\*)?` "**$2**"
| replaceRE `<\/summary>` ""

| replaceRE `<title>(.*)?<\/title>` "**$1**"
| replaceRE `<\/?(ol|ul)>` ""
| replaceRE `<li>\n?` ` - ` -}}

{{- if .full -}}
{{- $content = $content | replaceRE "(?m)^(#{2,6})(\\s|$)" (printf "${1}%s " $hashes) -}}
{{- end -}}

{{- $content = $content
  | replaceRE ` ([a-zA-Z0-9\@:-]){2,}="([][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)\&><↗\ -]{0,})"` ``
  | replaceRE "(`[^`]*?)( )?(<)([^>]+)(>)([^`^ ]*?`)" "${1}${2}##PLACEHOLDER_START##${4}##PLACEHOLDER_END##${6}"
  | replaceRE `<[^>]+>` ""
  | replaceRE "##PLACEHOLDER_START##(.*?)##PLACEHOLDER_END##" "<${1}>"
  | replaceRE `\[Back\]\([^)]+\)[\n|\ ]*\[[^\]]+\]\([^)]+\)` "\n"

  | replaceRE `(\n\ *)+\n` "\n\n"
-}}

{{- $content | htmlUnescape | safeHTML -}}
