<!-- shortcode start {{ .Name }} -->
## Connect database to app

Now connect the database to your app.

<div x-show="stack === 'php' || stack === 'nodejs' || stack === 'python'">

First, add the {{ .Site.Params.vendor.name }}  Config Reader library to make the connection easier.

<div x-show="stack === 'php'">

```bash
composer require platformsh/config-reader
```

</div>

<div x-show="stack === 'nodejs'">

```bash
npm install platformsh-config
```

</div>

<div x-show="stack === 'python'">

```bash
pip install platformshconfig
```

</div>

Then connect to the database in your app using the library.
You can choose where to do this depending on what makes sense in your app.

</div>

<div x-show="stack === 'php'">

{{ highlight ( readFile "static/files/fetch/examples/php/mysql" ) "php" "" }}

</div>

<div x-show="stack === 'nodejs'">

{{ highlight ( readFile "static/files/fetch/examples/nodejs/mysql" ) "js" "" }}

</div>

<div x-show="stack === 'python'">

{{ highlight ( readFile "static/files/fetch/examples/python/mysql" ) "python" "" }}

</div>

<div x-show="stack === 'golang'">

{{ highlight ( readFile "static/files/fetch/examples/golang/mysql" ) "go" "" }}

</div>

<div x-show="stack === 'java'">

{{ highlight ( readFile "static/files/fetch/examples/java/mysql" ) "java" "" }}

</div>
<!-- shortcode end {{ .Name }} -->
