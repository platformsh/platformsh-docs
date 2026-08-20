<!-- shortcode start {{ .Name }} -->
<div x-show="stack === 'python' || stack === 'nodejs' || stack === 'golang' || stack === 'java'">

To build your app, you may also need to add commands to go through the build process.
These are included in what's known as the build hook.

Add something similar to the following to the end of the file you just added:
</div>

<div x-show="stack === 'python'">

<ul class="{{ partial "codetabs/tab-control-list-styles" }}">
  <li class="{{ partial "codetabs/tab-control-tab-styles" }}">
    <a
      class="{{ partial "codetabs/tab-control-link-styles" }}"
      :class="{ '{{ partial "codetabs/tab-control-link-active-styles" }}': frametech === 'default' || frametech === 'pipenv' }"
      @click="switchFrametech('pipenv')"
    >
        Using pipenv
    </a>
  </li>
  <li class="{{ partial "codetabs/tab-control-tab-styles" }}">
    <a
      class="{{ partial "codetabs/tab-control-link-styles" }}"
      :class="{ '{{ partial "codetabs/tab-control-link-active-styles" }}': frametech === 'poetry' }"
      @click="switchFrametech('poetry')"
    >
        Using poetry
    </a>
  </li>
</ul>

<div role="tabpanel" x-show="frametech === 'default' || frametech === 'pipenv'" :aria-hidden="frametech === 'default' || frametech === 'pipenv'" class="{{ partial "codetabs/tab-styles" }} {{ partial "codetabs/tab-children-styles" }}">

```yaml {configFile="app"}
hooks:
    build: pipenv install --system --deploy
```

</div>

<div role="tabpanel" x-show="frametech === 'poetry'" :aria-hidden="frametech === 'poetry'" class="{{ partial "codetabs/tab-styles" }} {{ partial "codetabs/tab-children-styles" }}">

```yaml {configFile="app"}
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

<ul class="{{ partial "codetabs/tab-control-list-styles" }}">
  <li class="{{ partial "codetabs/tab-control-tab-styles" }}">
    <a
      class="{{ partial "codetabs/tab-control-link-styles" }}"
      :class="{ '{{ partial "codetabs/tab-control-link-active-styles" }}': frametech === 'default' }"
      @click="switchFrametech('default')"
    >
        Using npm
    </a>
  </li>
  <li class="{{ partial "codetabs/tab-control-tab-styles" }}">
    <a
      class="{{ partial "codetabs/tab-control-link-styles" }}"
      :class="{ '{{ partial "codetabs/tab-control-link-active-styles" }}':frametech === 'yarn3' }"
      @click="switchFrametech('yarn3')"
    >
        Using yarn 3+
    </a>
  </li>
  <li class="{{ partial "codetabs/tab-control-tab-styles" }}">
    <a
      class="{{ partial "codetabs/tab-control-link-styles" }}"
      :class="{ '{{ partial "codetabs/tab-control-link-active-styles" }}': frametech === 'yarnOld' }"
      @click="switchFrametech('yarnOld')"
    >
        Using yarn &lt;3
    </a>
  </li>
</ul>

<div role="tabpanel" x-show="frametech === 'default'" :aria-hidden="frametech === 'default'" class="{{ partial "codetabs/tab-styles" }} {{ partial "codetabs/tab-children-styles" }}">

```yaml {configFile="app"}
hooks:
    build: npm run build
```

</div>

<div role="tabpanel" x-show="frametech === 'yarn3'" :aria-hidden="frametech === 'yarn3'" class="{{ partial "codetabs/tab-styles" }} {{ partial "codetabs/tab-children-styles" }}">

```yaml {configFile="app"}
hooks:
    build: |
        # Fail the build if any part fails
        set -e
        corepack yarn install
        corepack yarn build
```

</div>

<div role="tabpanel" x-show="frametech === 'yarnOld'" :aria-hidden="frametech === 'yarnOld'" class="{{ partial "codetabs/tab-styles" }} {{ partial "codetabs/tab-children-styles" }}">

```yaml {configFile="app"}
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

```yaml {configFile="app"}
hooks:
    # Make sure the output matches your start command
    build:  go build -o bin/app
```

</div>

<div x-show="stack === 'java'">

<ul class="{{ partial "codetabs/tab-control-list-styles" }}">
  <li class="{{ partial "codetabs/tab-control-tab-styles" }}">
    <a
      class="{{ partial "codetabs/tab-control-link-styles" }}"
      :class="{ '{{ partial "codetabs/tab-control-link-active-styles" }}': frametech === 'default' }"
      @click="switchFrametech('default')"
    >
        Using Maven
    </a>
  </li>
  <li class="{{ partial "codetabs/tab-control-tab-styles" }}">
    <a
      class="{{ partial "codetabs/tab-control-link-styles" }}"
      :class="{ '{{ partial "codetabs/tab-control-link-active-styles" }}':frametech === 'gradle' }"
      @click="switchFrametech('gradle')"
    >
        Using Gradle
    </a>
  </li>
</ul>

<div role="tabpanel" x-show="frametech === 'default'" :aria-hidden="frametech === 'default'" class="{{ partial "codetabs/tab-styles" }} {{ partial "codetabs/tab-children-styles" }}">

```yaml {configFile="app"}
hooks:
    build: mvn clean package
```

</div>

<div role="tabpanel" x-show="frametech === 'gradle'" :aria-hidden="frametech === 'gradle'" class="{{ partial "codetabs/tab-styles" }} {{ partial "codetabs/tab-children-styles" }}">

Assuming you've committed Gradle to your repository.

```yaml {configFile="app"}
hooks:
    build: ./gradlew clean build --no-daemon
```

</div>

</div>
<!-- shortcode end {{ .Name }} -->
