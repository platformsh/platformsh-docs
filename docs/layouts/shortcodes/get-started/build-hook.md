<div x-show="stack === 'python' || stack === 'nodejs' || stack === 'golang' || stack === 'java'">

To build your app, you may also need to add commands to go through the build process.
These are included in what's known as the build hook.

Add something similar to the following to the end of the file you just added:
</div>

<div x-show="stack === 'python'">

```yaml {location=".platform.app.yaml"}
hooks:
    build: pipenv install --system --deploy
```

</div>

<div x-show="stack === 'nodejs'">

(This assumes you have your build process as part of a `build` script in your `package.json`)

```yaml {location=".platform.app.yaml"}
hooks:
    build: npm run build
```

</div>

<div x-show="stack === 'golang'">

```yaml {location=".platform.app.yaml"}
hooks:
    build:  go build -o bin/app
```

</div>

<div x-show="stack === 'java'">

(This assumes you're use Maven for the build.
Adjust as necessary.)

```yaml {location=".platform.app.yaml"}
hooks:
    build: mvn clean package
```

</div>
