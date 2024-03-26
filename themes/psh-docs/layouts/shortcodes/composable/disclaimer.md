{{ $title := "Note" }}
{{ $theme := "warning" }}
{{ $inner := "You can now use the Upsun composable image (BETA) to install runtimes and tools in your application container. To find out more, see the [dedicated documentation page](/create-apps/app-reference/composable-image.md)." }}
{{ partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) }}
