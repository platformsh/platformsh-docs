{{ $title := "Note" }}
{{ $theme := "warning" }}
{{ $inner := "Please note that [Composable Image (BETA)](/create-apps/app-reference/composable-image.md) has been released, and it would change the way you install runtimes in your application container." }}
{{ partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) }}
