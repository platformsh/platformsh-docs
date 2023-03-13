{{ $content := `This feature is currently in Beta and not available to all projects.
To become a Beta tester, you need to be an Enterprise or Elite customer
and [contact Support](/overview/get-support.html).
To upgrade to an Enterprise or Elite plan so you can take advantage of this feature,
[contact Sales](https://platform.sh/contact/) first.
`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Beta" )}}
