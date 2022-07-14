<div x-show="stack === 'python' || stack === 'nodejs' || stack === 'golang' || stack === 'java'">

To build your app, you may also need to add commands to go through the build process.
These are included in what's known as the build hook.

Add something similar to the following to the end of the file you just added:
</div>

<div x-show="stack === 'python'">

<div class="nav-tabs">
    <a
      class="nav-link"
      :class="{ 'active': frametech === 'default' || frametech === 'pipenv' }"
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

<div x-show="frametech === 'default' || frametech === 'pipenv'">

```yaml {location=".platform.app.yaml"}
hooks:
    build: pipenv install --system --deploy
```

</div>

<div x-show="frametech === 'poetry'">

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        # Fail the build if any part fails
        set -e
        # Install poetry
        export PIP_USER=false
        curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
        export PIP_USER=true
        # Install dependencies
        poetry install
```

</div>

</div>

<div x-show="stack === 'nodejs'">

(This assumes you have your build process as part of a `build` script in your `package.json`)

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
hooks:
    build: npm run build
```

</div>

<div x-show="frametech === 'yarn3'">

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        # Fail the build if any part fails
        set -e
        corepack yarn install
        corepack yarn build
```

</div>

<div x-show="frametech === 'yarnOld'">

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        # Fail the build if any part fails
        set -e
        yarn --frozen-lockfile
        yarn build
```

</div>

</div>

<div x-show="stack === 'golang'">

```yaml {location=".platform.app.yaml"}
hooks:
    # Make sure the output matches your start command
    build:  go build -o bin/app
```

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
hooks:
    build: mvn clean package
```

</div>

<div x-show="frametech === 'gradle'">

Assuming you've committed Gradle to your repository.

```yaml {location=".platform.app.yaml"}
hooks:
    build: ./gradlew clean build --no-daemon
```

</div>

</div>
