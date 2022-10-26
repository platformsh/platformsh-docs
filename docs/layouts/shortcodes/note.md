{{ $title := .Get "title"}}
{{ $theme := .Get "theme"}}
{{ $inner := .Inner }}
{{ partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) }}
