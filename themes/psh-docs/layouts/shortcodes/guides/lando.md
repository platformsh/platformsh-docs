[Lando](https://github.com/lando/lando) is a local development tool.
Lando can read your Platform.sh configuration files for WordPress
and produce an approximately equivalent configuration using Docker
See a guide on [using Lando with Platform.sh](/development/local/lando.html).

Templates come configured for use already with a base [Landofile](https://docs.lando.dev/config/lando.html),
as in the following example.
It can be helpful getting started with Lando without the need to have a project on Platform.sh.
This file sets up good defaults for Lando and Platform.sh-configured codebases,
most notably through the `recipe` attribute.

{{ $file := printf "static/files/fetch/lando/%s" (.Get "repo" ) }}
{{ highlight ( readFile $file ) "yaml" ""}}

This Landofile is also where you can configure access to tools
that would normally be available within a Platform.sh app container (such as the WordPress CLI)
and that you also want to access locally.

You can replicate this file or follow the guide on [using Lando with Platform.sh](/development/local/lando.html).
Once you have completed the configuration, you can start your local environment by running:

```bash
lando start
```
