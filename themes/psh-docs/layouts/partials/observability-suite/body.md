{{ $content := `This feature is available as part of the [Observability Suite](https://platform.sh/features/observability-suite/).
To add the Observability Suite to your project and take advantage of this feature,
[contact Sales](https://platform.sh/contact/).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Observability Suite" )}}
