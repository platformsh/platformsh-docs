{{ $content := `This feature is available on Grid HA (High Availability) and {{% names/dedicated-gen-3 %}} projects. For more information, [contact Sales](https://platform.sh/contact/).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature availability" )}}
