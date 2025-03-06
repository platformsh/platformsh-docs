---
#################################
# Don't touch these settings.
date: '{{ .Date }}'
sidebar:
    exclude: true
type: post
#################################
# Update the title
title: "Include a short, descriptive title"

# Replace if you have a good image. 
# Images are not used (yet) on individual pages, only on lists of articles.
image: /images/red-background.webp

# Define this value if listing an external blog post not written within this site.
#link: "https://upsun.com/blog/blackfire-infrastructure-processes/"

# Update author with one or more
#   -> content/community/engage/people/AUTHOR.md
#   -> https://github.com/AUTHOR
#   -> AUTHORFirst AUTHORLast
author:
  - upsun

# Choose ONE of the options below:
categories:
#   - compare
#   - core-concepts
#   - how-it-works
#   - discussions
#   - experiments
  - how-tos
#   - releases
#   - transcripts
#   - tutorials
#   - use-cases

# Tags don't do anything yet, so ignore for now.
# tags:
#   - events
#   - integrations
math: true
---
<!-- 
## Lorem markdownum?

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis!

- Est si easdem omnes correptus
- Carmen nixus
- Ulcisci imas blanditiis suam innumeris ubi
- Perdidimus pendens paratis continuere solet trepidare amplius
- Officio sensit qui videtur mens
- An fors est

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu*. 

$$F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-j\omega t} \, dt$$

Nunc [additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi. Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

## Officio sensit qui videtur mens

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis!

![Bike people](/images/hero-people-riding-bike.png)

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu*. Nunc
[additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi. Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

{{< figure src="/images/upsun-console-main-view.png" title="Figure 1. All projects view for the ColsonInc organization in the Upsun console" >}}

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu* [^1]. Nunc
[additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi. Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

[^1]: Congrats! You found the footnote. Use the link below to find the other one.

## Alienisque requirent

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis!

<div class="hx-mt-6"></div>

{{< youtube fC3Cthm0HFU >}}

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu*. Nunc
[additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi. Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

## Carmen nixus?

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis!

```yaml {filename=".upsun/config.yaml" lineNos="true" lineNoStart="1" hl_Lines="5-9"}
applications:
  myapp:
    source:
      root: dev
    stack:
      - nodejs@22
      - nodePackages.npm
      - python312
      - hugo
    hooks:
      build: |
        npm install
        npm run build 
    web:
      locations:
        /:
          root: "public"
          passthru: true
          index:
            - index.html
```

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu*. Nunc
[additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi. Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

## Gemitu in caelum?

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis!

{{< callout type="warning" >}}
  Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem.
{{< /callout >}}

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu*. Nunc
[additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi. Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

## Caeloque subdita flammasque?

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis! [^2]

{{% details title="Lorem markdownum" closed="true" %}}

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu*. Nunc
[additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi.

{{% /details %}}

Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

[^2]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.

## Tibi, aera Cumaea

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis!

{{< filetree/container >}}
  {{< filetree/folder name=".upsun" >}}
    {{< filetree/file name="config.yaml" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="hello" state="open" >}}
    {{< filetree/file name="\_\_init\_\_.py" >}}
    {{< filetree/file name="settings.py" >}}
    {{< filetree/file name="urls.py" >}}
    {{< filetree/file name="wsgi.py" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="myapp" state="open" >}}
    {{< filetree/file name="\_\_init\_\_.py" >}}
    {{< filetree/file name="admin.py" >}}
    {{< filetree/file name="apps.py" >}}
    {{< filetree/file name="models.py" >}}
    {{< filetree/file name="tests.py" >}}
    {{< filetree/file name="urls.py" >}}
    {{< filetree/file name="views.py" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="requirements.txt" >}}
{{< /filetree/container >}}

Sensit haec illo spectator frui gravidus ordine latitant. Quod eris, vota ensem
pectus patria quidem; *lacrimae nutu*. {{< icon "backup" >}} 

Nunc [additur](http://condit-filia.com/solvit), et munera geminos dixit, nec habemus,
illi. Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea.

{{% steps %}}

### Step 1

This is the first step.

### Step 2

This is the second step.

### Step 3

This is the third step.

{{% /steps %}}

## Caeloque subdita flammasque?

Lorem markdownum, Aries, cum formae, illius, gemitu in caelum, iste, praebet
oculos. In quas alienisque requirenti caesis metallis vestros. Ocius suum
accensum: iners [plangorem adhibere ensem](http://se-ora.com/) et aliquid meum
lacertis!

{{< tabs items="JSON,YAML,TOML" >}}

{{< tab >}}**JSON**: JavaScript Object Notation (JSON) is a standard text-based format for representing structured data based on JavaScript object syntax.{{< /tab >}}
{{< tab >}}**YAML**: YAML is a human-readable data serialization language.{{< /tab >}}
{{< tab >}}**TOML**: TOML aims to be a minimal configuration file format that's easy to read due to obvious semantics.{{< /tab >}}

{{< /tabs >}}

Caeloque subdita flammasque hanc timide patuit causas nos solus fecisse:
refert tibi, aera Cumaea. -->
