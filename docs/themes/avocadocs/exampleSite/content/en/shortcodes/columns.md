---
title: "Columns"
weight: 4
---

{{< alert theme="warning" >}}<b>LIMITED:</b> This shortcode is a `WIP` and comes with some limitations and caveats.{{< /alert >}}


{{< callout theme="success" >}}
##### Functional

* simple text
* headings and basic markdown formatting
* backtick-formatted syntax highlighting
{{< /callout >}}

{{< callout theme="danger" >}}
##### Limitations & caveats

* At this point, only **two** columns are supported.
* shortcodes used within a column **do not** render properly, which includes basic images, youtube, figures, etc.
* In testing, columns render as expected on desktop and iPad Pro only. On all other mobile devices, columns become a **single column** rather than having their widths scaled.
{{< /callout >}}

## Text

{{< columns >}}

##### Something

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vulputate, odio eget mattis venenatis, orci lacus cursus elit, ut mollis sem diam vel erat. Nam eu mattis ante. Sed id orci egestas, viverra lacus at, consectetur erat. Integer bibendum, orci sed maximus consectetur, dolor tortor consectetur tellus, non eleifend massa orci ut arcu.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vulputate, odio eget mattis venenatis, orci lacus cursus elit, ut mollis sem diam vel erat. Nam eu mattis ante. Sed id orci egestas, viverra lacus at, consectetur erat. Integer bibendum, orci sed maximus consectetur, dolor tortor consectetur tellus, non eleifend massa orci ut arcu.

<--->

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vulputate, odio eget mattis venenatis, orci lacus cursus elit, ut mollis sem diam vel erat. Nam eu mattis ante. Sed id orci egestas, viverra lacus at, consectetur erat. Integer bibendum, orci sed maximus consectetur, dolor tortor consectetur tellus, non eleifend massa orci ut arcu.

##### Something else

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vulputate, odio eget mattis venenatis, orci lacus cursus elit, ut mollis sem diam vel erat. Nam eu mattis ante. Sed id orci egestas, viverra lacus at, consectetur erat. Integer bibendum, orci sed maximus consectetur, dolor tortor consectetur tellus, non eleifend massa orci ut arcu.

{{< /columns >}}

## Code

{{< columns >}}

```yaml
name: app

type: "python:3.7"

dependencies:
    python:
        pipenv: "2018.10.13"

hooks:
    build: |
      pipenv install --system --deploy

disk: 1024

relationships:
    database: "db:mysql"
    redis: "cache:redis"

web:
    commands:
        start: python app.py
```

<--->

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vulputate, odio eget mattis venenatis, orci lacus cursus elit, ut mollis sem diam vel erat. Nam eu mattis ante.

* `name`: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
* `type`: Fusce vulputate, odio eget mattis venenatis.
* `dependencies`: Orci lacus cursus elit, ut mollis sem diam vel erat.
  * `python`: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
* `hooks`: Nam eu mattis ante.
  * `build`: Fusce vulputate, odio eget mattis venenatis.
  * `deploy`: Fusce vulputate, odio eget mattis venenatis.
* `relationships`: Fusce vulputate, odio eget mattis venenatis.
  * `<relationship_name>: "<service_name>:<endpoint>"`
* `web`: Fusce vulputate, odio eget mattis venenatis.
  * `commands`: Fusce vulputate, odio eget mattis venenatis.
    * `start`: Fusce vulputate, odio eget mattis venenatis.

Sed id orci egestas, viverra lacus at, consectetur erat. Integer bibendum, orci sed maximus consectetur, dolor tortor consectetur tellus, non eleifend massa orci ut arcu.


{{< /columns >}}
