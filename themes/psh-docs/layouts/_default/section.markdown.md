{{ partial "llms/replace-html.md" ( dict "Context" . "content" .RenderShortcodes "title" .Params.title "version" .Site.Params.vendor.config.version "vendor" .Site.Params.vendor ) }}
