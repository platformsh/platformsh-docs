---
title: "Something"
menu:
  main:
    parent: 'others'
    weight: 2
---

{{ if in .Section $currentPage }}

  <!-- SECOND LEVEL ITEM -->
  <li class="duik-sidebar__item">
    <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
        <span style="display:inline-block; width: {{ $levelTwoIndent }};"></span>{{ .Name }}
    </a>
  </li>

{{ end }}



## This is the current working version described in the readme

<!-- Show Second level children if the first level Parent or any of its Second level siblings are the currentPage -->
{{ if or (eq $currentPage .Parent) (or ( in $levelTwoPages $currentPage ) (in $levelThreePages $currentPage) ) }}

  <!-- SECOND LEVEL ITEM -->
  <li class="duik-sidebar__item">
    <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
        <span style="display:inline-block; width: {{ $levelTwoIndent }};"></span>{{ .Name }}
    </a>
  </li>

  <!-- Show Third level children if the second level Parent or any its siblings are the currentPage -->
  {{ if and (ne $levelThreePages "") (or ( in $levelTwoPages $currentPage ) (in $levelThreePages $currentPage) ) }}

    {{ range $levelThreePages }}

      <!-- THIRD LEVEL ITEM -->
      <li class="duik-sidebar__item">
        <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
            <span style="display:inline-block; width: {{ $levelThreeIndent }};"></span>{{ .Name }}
        </a>
      </li>

    {{ end }}

  {{ end }}


{{ end }}


## end


<!-- Show Second level children if the first level Parent or any of its Second level siblings are the currentPage -->
{{ if or ( eq $currentPage .Parent ) ( in $levelTwoPages $currentPage ) }}

  {{ if in $levelThreePages $currentPage }}

    <!-- SECOND LEVEL ITEM -->
    <li class="duik-sidebar__item">
      <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
          <span style="display:inline-block; width: {{ $levelTwoIndent }};"></span>{{ .Name }}
      </a>
    </li>

    <!-- Show Third level children if the second level Parent or any its siblings are the currentPage -->
    {{ if ne $levelThreePages ""}}

      {{ if in $levelThreePages $currentPage }}

        {{ range $levelThreePages }}

          <!-- THIRD LEVEL ITEM -->
          <li class="duik-sidebar__item">
            <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
                <span style="display:inline-block; width: {{ $levelThreeIndent }};"></span>{{ .Name }}
            </a>
          </li>

        {{ end }}

      {{ end }}


    {{ end }}

  {{ else }}

    <!-- SECOND LEVEL ITEM -->
    <li class="duik-sidebar__item">
      <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
          <span style="display:inline-block; width: {{ $levelTwoIndent }};"></span>{{ .Name }}
      </a>
    </li>


  {{ end }}


{{ end }}









something page that's currently hidden.

{{ $levelTwoPages := .Pages }}
{{ range $levelTwoPages }}

  {{ if or (eq $currentPage .Parent) (in $levelTwoPages $currentPage) }}



    {{ if eq .Kind "section"}}

      <li class="duik-sidebar__item">
        <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
            <span style="display:inline-block; width: {{ $levelTwoIndent }};"></span>{{ .Name }} ***
        </a>
      </li>

      {{ $levelThreePages := .Pages }}

      {{ range $levelThreePages }}

        {{ if or (eq $currentPage .Parent) (in $levelThreePages $currentPage) }}
          <li class="duik-sidebar__item">
            <a href="{{ .RelPermalink }}" class="duik-sidebar__link{{ if eq $currentPage . }} active{{ end }}">
                <span style="display:inline-block; width: {{ $levelThreeIndent }};"></span>{{ .Name }} *****
            </a>
          </li>

        {{ end }}

      {{ end }}



    {{ end  }}

  {{ end }}
