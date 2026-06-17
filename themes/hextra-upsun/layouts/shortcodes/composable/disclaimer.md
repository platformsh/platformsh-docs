{{ $title := "Note" }}
{{ $theme := "info" }}
{{ $inner := "You can now use composable image (BETA) to install runtimes and tools in your application container. To find out more, see the [dedicated documentation page](/create-apps/app-reference/composable-image.md)." }}
{{ partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) }}
