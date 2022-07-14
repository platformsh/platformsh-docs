## Connect database to app

Now connect the database to your app.

<div x-show="stack === 'php' || stack === 'nodejs' || stack === 'python'">

First, add the Platform.sh Config Reader library to make the connection easier.

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

</div>

<div x-show="stack === 'php'">

```php
{{ readFile "static/files/fetch/examples/php/mysql" }}
```

</div>

<div x-show="stack === 'nodejs'">

```js
{{ readFile "static/files/fetch/examples/nodejs/mysql" }}
```

</div>

<div x-show="stack === 'python'">

```python
{{ readFile "static/files/fetch/examples/python/mysql" }}
```

</div>

<div x-show="stack === 'golang'">

```python
{{ readFile "static/files/fetch/examples/golang/mysql" }}
```

</div>

<div x-show="stack === 'java'">

```python
{{ readFile "static/files/fetch/examples/golang/mysql" }}
```

</div>