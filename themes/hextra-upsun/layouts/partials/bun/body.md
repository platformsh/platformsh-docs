{{ $content := `[Bun is available as a runtime and package manager](https://platform.sh/blog/bun-support-is-here/) for Node.js **versions 20 or above**.`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Availability" )}}
