{{- if .title }}# {{ .title | replaceRE `\{\{[%\|\<]?\ *vendor\/name\ *[\%|\>]?\}\}` "Upsun" }}
{{ end }}
{{- .content
| replaceRE `<a href=\"([][a-zA-Z0-9\.\_\!\+\#:='\''\;,\/\{\}\(\)\&><↗\ -]+)?\".*\>(.*)?<\/a>` `[$2]($1)`
| replaceRE ` ([a-zA-Z0-9\@:-]){2,}="([][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)\&><↗\ -]{0,})"` ``

| replaceRE `\[(.*)?\]\((../../)+?(.*)?\) ` `[$1](https://docs.upsun.com/$3) `
| replaceRE `\[(.*)?\]\((../../)+?(.*)?\)\n` "[$1](https://docs.upsun.com/$3)\n"
| replaceRE `\[(.*)?\]\((../../)+?(.*)?\)\.` `[$1](https://docs.upsun.com/$3).`
| replaceRE `\[(.*)?\]\((../../)+?(.*)?\),` `[$1](https://docs.upsun.com/$3),`
| replaceRE `\[(.*)?\]\((../../)+?(.*)?\)\*` `[$1](https://docs.upsun.com/$3)*`
| replaceRE `(\[.*\])?\((../)+?(.*)?\) ` `$1(https://docs.upsun.com/$3) `
| replaceRE `(\[.*\])?\((../)+?(.*)?\)\n` "$1(https://docs.upsun.com/$3)\n"
| replaceRE `(\[.*\])?\((../)+?(.*)?\)\.` `$1(https://docs.upsun.com/$3).`
| replaceRE `(\[.*\])?\((../)+?(.*)?\),` `$1(https://docs.upsun.com/$3),`
| replaceRE `(\[.*\])?\((../)+?(.*)?\)\*` `$1(https://docs.upsun.com/$3)*`
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\) ` `$1.md$4) `
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\)\n` "$1.md$4)\n"
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\)\.` `$1.md$4).`
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\),` `$1.md$4),`
| replaceRE `(\[.*\]\(.*/(.*))?(/_index.md)+?(.*)?\)\*` `$1.md$4)*`

| replaceRE `(<!--[][a-zA-Z0-9_\ \/:@()\*\n\?#,.-]+-->)` ``
| replaceRE `(<style>[][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)#\&\n\ -]+<\/style>)` ``
| replaceRE `<div>Terminal<\/div>\n` ``
| replaceRE `<div>\.upsun\/config\.yaml<\/div>\n` ``
| replaceRE `<div>\.environment<\/div>\n` ``
| replaceRE `<div>export\-config\.sh<\/div>\n` ``
| replaceRE `<div\nx\-data(.*\n)+>` ""
| replaceRE `<(pre|var|span|p|div|a).*?>` ``
| replaceRE `<\/(pre|var|span|p|div|a|li)>` ``
| replaceRE `<code>([][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)\&↗\ -]+)<\/code>` "`$1`"
| replaceRE `<code>(.*)+\n` "```\n$1\n"
| replaceRE `<\/code>` "\n```"
| replaceRE `<img\ ?\/?>` ``
| replaceRE `<h3\b[^>]*>\n*\ *(.*)\n*\ *<\/h3>` "\n\n### $1\n"
| replaceRE `<h4\b[^>]*>\n*\ *(.*)\n*\ *<\/h4>` "\n\n#### $1"
| replaceRE `<\/br>` " "
| replaceRE `\[(.*)?\]\((#.*)?\)` `$1`

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
| replaceRE `<svg>(<title>)?(.*?)(<\/title>)?\n*(.*?)<\/svg>` ""
| replaceRE `<details>\n` ""
| replaceRE `<\/details>\n` ""
| replaceRE `\ *<summary>(<b>|\*\*)?([][a-zA-Z0-9\.\_\!\+:='\''\;,\/\{\}\(\)\&↗\ -]+)(<\/b>|\*\*)?` "**$1**"
| replaceRE `<\/summary>` ""

| replaceRE `<title>(.*)?<\/title>` "**$1**"
| replaceRE `<\/?(ol|ul)>` ""
| replaceRE `<li>\n?` ` - `

| replaceRE `(\n\ *)+\n` "\n\n"

| replaceRE `(\[.*\])?\(\/((\/images\/)?(.*)?(.*)?)\)` "$1(https://docs.upsun.com/$4)"

| htmlUnescape
}}
