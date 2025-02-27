<!-- shortcode start {{ .Name }} -->
For example, to use `pipenv` to manage requirements and a virtual environment, add the following:

```yaml {configFile="app"}
dependencies:
    python3:
        pipenv: "2022.12.19"

hooks:
    build: |
        set -eu
        pipenv install --system --deploy
```
<!-- shortcode end {{ .Name }} -->
