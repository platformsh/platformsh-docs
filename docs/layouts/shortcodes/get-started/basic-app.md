<div x-show="stack === 'php'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'php:8.0'

# Indicate to use composer2, (leave out if you want composer1)
dependencies:
    php: 
        composer/composer: '^2'

# The size of the persistent disk of the application (in MB)
disk: 2048

# The configuration of app when it's exposed to the web.
web:
    locations:
        "/":
            # The public directory of the app, relative to its root.
            root: "web"
            # The front-controller script to send non-static requests to.
            passthru: "/index.php"
```

</div>

<div x-show="stack === 'python'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'python:3.10'

# The build-time dependencies of the app.
dependencies:
    python3:
       pipenv: "2022.6.7"

# The size of the persistent disk of the application (in MB)
disk: 1024
```

</div>

<div x-show="stack === 'nodejs'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'nodejs:16'

# The size of the persistent disk of the application (in MB)
disk: 512

# The configuration of app when it's exposed to the web.
web:
    commands:
        start: node index.js
```

You may need to adapt the start command to fit your app.
</div>
