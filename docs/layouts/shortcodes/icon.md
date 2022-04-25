{{ $icon := .Get 0 }}
{{ $iconFile := printf "layouts/shortcodes/icon-paths/%s.html" $icon }}

<svg class="icon-{{ $icon }}" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="{{ $icon }}-icon" aria-hidden="true">
  {{ readFile $iconFile | safeHTML }}
</svg>