{{ $content := `This feature is only available to Enterprise and Elite customers and is currently in Beta.
If you’re an Enterprise or Elite customer, to become a Beta tester [contact Support](/overview/get-support.html).
If you’re a Professional customer, you need to [contact Sales](https://platform.sh/contact/) first to upgrade your plan.
`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Beta" )}}
