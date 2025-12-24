{{ $title := "Note" }}
{{ $theme := "info" }}
{{ $inner := "You can now use composable image to install runtimes and tools in your application container. To find out more, see the [Composable image](/create-apps/app-reference/composable-image.md) topic." }}
{{ partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) }}
