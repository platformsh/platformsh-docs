<div x-show="stack === 'php'">

<div class="nav-tabs">
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'default' }"
      @click="switchFrametech('default')"
    >
        Using PHP-FPM
    </a>
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'socket' }"
      @click="switchFrametech('socket')"
    >
        Listening on a socket
    </a>
</div>

<div x-show="frametech === 'default'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'php:8.0'

# Indicate to use Composer 2 (leave out if you want Composer 1)
# See how without Composer: https://docs.platform.sh/guides/wordpress/vanilla.html
dependencies:
    php: 
        composer/composer: '^2'

# The size of the persistent disk of the application (in MB)
disk: 2048

# Your app's configuration when it's exposed to the web.
web:
    locations:
        "/":
            # The public directory of the app, relative to its root.
            root: "web"
            # The front-controller script to send non-static requests to.
            passthru: "/index.php"
```

</div>

<div x-show="frametech === 'socket'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'php:8.0'

# Indicate to use Composer 2 (leave out if you want Composer 1)
# See how without Composer: https://docs.platform.sh/guides/wordpress/vanilla.html
dependencies:
    php: 
        composer/composer: '^2'

# The size of the persistent disk of the application (in MB)
disk: 2048

# Your app's configuration when it's exposed to the web.
web:
    # Set the upstream property to create a socket to listen to
    upstream:
        socket_family: tcp
        protocol: http
    
    # Set the specific command to start your app
    # using the provided port
    commands:
        start: php path/to/start/command --port=$PORT

    locations:
        "/":
            # Send all requests through to the app
            allow: false
            passthru: true
```

</div>
</div>

<div x-show="stack === 'python'">

<div class="nav-tabs">
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'default' }"
      @click="switchFrametech('default')"
    >
        Using pip
    </a>
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'pipenv' }"
      @click="switchFrametech('pipenv')"
    >
        Using pipenv
    </a>
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'poetry' }"
      @click="switchFrametech('poetry')"
    >
        Using poetry
    </a>
</div>

<div x-show="frametech === 'default'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'python:3.10'

# The size of the persistent disk of the application (in MB)
disk: 1024

# Your app's configuration when it's exposed to the web.
web:
    commands:
        start: python app.py
```

You may need to adapt the start command to fit your app.

</div>

<div x-show="frametech === 'pipenv'">

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

# Your app's configuration when it's exposed to the web.
web:
    upstream:
        # Ensure your app listens on the right socket
        socket_family: unix
    commands:
        # The exact command varies based on the server you use

        # 1) ASGI: daphne
        start: "pipenv run daphne app.asgi:application"
        # 2) ASGI: uvicorn
        start: "pipenv run gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b unix:$SOCKET app.wsgi:application"
        # 3) ASGI: hypercorn
        start: "pipenv run hypercorn app.asgi:application"
        # 4) WSGI: gunicorn
        start: "pipenv run gunicorn -w 4 -b unix:$SOCKET app.wsgi:application"
```

</div>

<div x-show="frametech === 'poetry'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'python:3.10'

# Set properties for poetry
variables:
    env:
        POETRY_VERSION: '1.1.14'
        POETRY_VIRTUALENVS_IN_PROJECT: true
        POETRY_VIRTUALENVS_CREATE: false

# The size of the persistent disk of the application (in MB)
disk: 1024

web:
    upstream:
        # Ensure your app listens on the right socket
        socket_family: unix
    commands:
        # The exact command varies based on the server you use

        # 1) ASGI: daphne
        start: "poetry run daphne app.asgi:application"
        # 2) ASGI: uvicorn
        start: "poetry run gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b unix:$SOCKET app.wsgi:application"
        # 3) ASGI: hypercorn
        start: "poetry run hypercorn app.asgi:application"
        # 4) WSGI: gunicorn
        start: "poetry run gunicorn -w 4 -b unix:$SOCKET app.wsgi:application"
```

</div>

</div>

<div x-show="stack === 'nodejs'">

<div class="nav-tabs">
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'default' }"
      @click="switchFrametech('default')"
    >
        Using npm
    </a>
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'yarn3' }"
      @click="switchFrametech('yarn3')"
    >
        Using yarn 3+
    </a>
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'yarnOld' }"
      @click="switchFrametech('yarnOld')"
    >
        Using yarn &lt;3
    </a>
</div>

<div x-show="frametech === 'default'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'nodejs:16'

# The size of the persistent disk of the application (in MB)
disk: 512

# Your app's configuration when it's exposed to the web.
web:
    commands:
        start: NODE_ENV=production npm run start
```
</div>

<div x-show="frametech === 'yarn3'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'nodejs:16'

# Turn off the default use of npm
build:
    flavor: none

# The size of the persistent disk of the application (in MB)
disk: 512

# Your app's configuration when it's exposed to the web.
web:
    commands:
        start: NODE_ENV=production yarn start
```

</div>

<div x-show="frametech === 'yarnOld'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'nodejs:16'

# Turn off the default use of npm
build:
    flavor: none

# Include yarn as a global dependency
dependencies:
    nodejs:
        yarn: "1.22.19"

# The size of the persistent disk of the application (in MB)
disk: 512

# Your app's configuration when it's exposed to the web.
web:
    commands:
        start: NODE_ENV=production yarn start
```

</div>

This assumes you start your app with a `start` script in your `package.json`.
You may need to adapt the start command to fit your app.
</div>

<div x-show="stack === 'golang'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'golang:1.18'

# The size of the persistent disk of the application (in MB)
disk: 512

# Your app's configuration when it's exposed to the web.
web:
    commands:
        # This should match the output of your build command
        start: ./bin/app
```

You may need to adapt the start command to fit your app.
</div>

<div x-show="stack === 'java'">

<div class="nav-tabs">
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'default' }"
      @click="switchFrametech('default')"
    >
        Using Maven
    </a>
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'gradle' }"
      @click="switchFrametech('gradle')"
    >
        Using Gradle
    </a>
</div>

<div x-show="frametech === 'default'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'java:14'

# The size of the persistent disk of the application (in MB)
disk: 512

# Your app's configuration when it's exposed to the web.
web:
    commands:
        start: java -jar $JAVA_OPTS target/app.jar --server.port=$PORT
```
</div>

<div x-show="frametech === 'gradle'">

```yaml {location=".platform.app.yaml"}
# The name of the app. Must be unique within a project.
name: app

# The type of the application to build
type: 'java:14'

# The size of the persistent disk of the application (in MB)
disk: 512

# Your app's configuration when it's exposed to the web.
web:
    commands:
        # Adapt the `app.jar` to what's in `build.gradle`
        start: java -jar $JAVA_OPTS build/libs/app.jar --server.port=$PORT
```
</div>

You may need to adapt the start command to fit your app.
</div>
