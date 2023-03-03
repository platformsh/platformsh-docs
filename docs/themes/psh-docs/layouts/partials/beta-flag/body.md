{{ $content := `This feature is currently in beta and not available to all projects.
If you think you would benefit from this feature and want to add it to your plan,
[contact support](/overview/get-support.html).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Beta" )}}
