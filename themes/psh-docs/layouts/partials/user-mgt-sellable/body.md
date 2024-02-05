{{ $content := `This feature is available as part of the Standard User Management add-on.
To add it to your project, [contact Sales](https://platform.sh/contact/).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature Availability" )}}
