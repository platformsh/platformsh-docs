<div x-show="stack === 'python' || stack === 'nodejs'">

To build your app, you may also need to add commands to go through the build process.
These are included in what's known as the build hook.
Add the following to the end of the file you just added:
</div>

<div x-show="stack === 'python'">

```yaml {location=".platform.app.yaml"}
hooks:
    build: pipenv install --system --deploy
```

</div>

<div x-show="stack === 'nodejs'">

```yaml {location=".platform.app.yaml"}
hooks:
    build: npm run build
```

</div>
