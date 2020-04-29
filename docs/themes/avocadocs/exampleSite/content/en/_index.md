---
title: Introduction
---

## Purpose

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et dui eu ex tincidunt cursus et id enim. Mauris vitae sapien felis. Aliquam id ligula ultricies, feugiat erat at, elementum sem. Sed ac consectetur nibh, fringilla mollis tortor. Ut elementum ac eros eu tempus.

Cras cursus sapien quis ipsum pulvinar bibendum. Proin iaculis dignissim quam sit amet hendrerit. Donec consectetur vel lectus sit amet egestas. Pellentesque pharetra ligula a mi dapibus efficitur.

```yaml
# .platform.app.yaml

# The name of this application, which must be unique within a project.
name: 'app'

# The type key specifies the language and version for your application.
type: 'nodejs:10'

# The hooks that will be triggered when the package is deployed.
hooks:
    # Build hooks can modify the application files on disk but not access any services like databases.
    build: !include
      type: string
      path: build.sh

# The size of the persistent disk of the application (in MB).
disk: 5120

# The configuration of the application when it is exposed to the web.
web:
    locations:
        '/exampleSite':
            # The public directory of the application relative to its root.
            root: 'public'
            index: ['index.html']
            scripts: false
            allow: true
```

## Getting started

Mauris orci nisl, finibus quis libero in, aliquam iaculis lacus. Vestibulum sit amet mi fermentum, posuere mauris sit amet, blandit leo. In ante urna, congue eu justo vel, egestas luctus ante. Fusce luctus massa varius ligula varius, sed rutrum nisi interdum. Vestibulum vehicula nisi consequat nulla molestie, in rutrum orci ornare. Sed commodo erat ac dignissim pretium. Fusce sagittis efficitur arcu, ac elementum metus varius eu. Vestibulum id mattis nunc.

{{< asciinema src="videos/asciinema/project-create.cast" >}}

Donec at lacus venenatis, fringilla libero in, venenatis enim. Donec lacus elit, posuere id libero in, semper dictum libero. Proin in felis at nunc cursus luctus. Duis eu vestibulum odio. Pellentesque malesuada ultricies dui et fringilla.

Vivamus lobortis vitae ligula nec condimentum. Aliquam vitae nibh orci. Etiam quis pellentesque lorem. Vestibulum suscipit lorem in leo rutrum hendrerit.

## What's with the name?

The reference to avocados comes from a talk given by [Mary Thengvall](https://www.marythengvall.com) called [*DevRel: Advocates, Evangelists, and Avocados*](https://www.youtube.com/watch?v=mrEhwqshxiM) and her book [*The Business Value of Developer Relations: How and Why Technical Communities Are Key To Your Success*](https://www.amazon.com/Business-Value-Developer-Relations-Communities/dp/1484237471).

Avocados are

* "Good fat"
* Take on the flavor of what's around them
* Long time to ripen

**avocadocs** was created and is maintained by the Developer Relations team at [Platform.sh](https://platform.sh/). In that same book, Thengvall continues with:

Developer relations

* DevRel is good for you
* Inter-disciplinary, eclectic skillset, fluid and changing
* DevRel is the long game

**avocadocs** was created and is maintained by the Developer Relations team at [Platform.sh](https://platform.sh/), and we have made this theme public for other documentation teams to use because documentation efforts matter so much to software projects. We use this theme for our own [documentation](https://github.com/platformsh/platformsh-docs), so we will always try to make this tool as helpful and easy to work with as possible. We want our docs to be top notch, and the same goes for yours. It will remain public as a way to give back to all of the other teams out there that, like us, take documentation seriously.
