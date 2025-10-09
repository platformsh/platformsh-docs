{{ $content := `This feature is available on Grid HA (High Availability) and {{% names/dedicated-gen-3 %}} projects. For more information, [contact Sales](https://upsun.com/contact-us/).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature availability" )}}
