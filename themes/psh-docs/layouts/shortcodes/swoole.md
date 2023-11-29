<!-- shortcode start {{ .Name }} -->
## Install

Install the PHP extension for Swoole or Open Swoole during the build.

Take advantage of an [installation script](https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh).
You need to pass 2 parameters:

* Which Swoole project to use: `openswoole` or `swoole`
* Which version to install

{{ if eq .Page.Site.Params.vendor.config.version 1 }}

```yaml {configFile="app"}
hooks:
    build: |
        set -e
        ...
        curl -fsS https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh | { bash /dev/fd/3 openswoole 4.11.0 ; } 3<&0
```

{{ else }}

```yaml {configFile="app"}
applications:
    app:
        type: 'php:<VERSION>'
        hooks:
            build: |
                set -e
                ...
                curl -fsS https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh | { bash /dev/fd/3 openswoole 4.11.0 ; } 3<&0
```

{{ end }}
<!-- shortcode end {{ .Name }} -->
