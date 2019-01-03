# Custom php.ini

There are two ways to customize `php.ini` values for your application. The recommended method is to use the [`variables` property](/configuration/app/variables.md) of `.platform.app.yaml` to set ini values using the `php` prefix. For example, to increase the PHP memory limit you'd put the following in `.platform.app.yaml`:

```yaml
variables:
  php:
    memory_limit: 256M
```

It's also possible to provide a custom `php.ini` file in the repository in the root of the application (where your `.platform.app.yaml` file is).

```ini
; php.ini
; Increase PHP memory limit
memory_limit = 256M
```

Another example is to set the timezone of the PHP runtime (though, the timezone settings of containers/services would remain in UTC):

```yaml
variables:
  php:
    "date.timezone": "Europe/Paris"
```

or

```ini
; php.ini
; Set PHP runtime timezone
date.timezone = "Europe/Paris"
```

Environment-specific `php.ini` configuration directives can be provided via environment variables separately from the application code. See the note in the [Environment variables](/development/variables.md#php-specific-variables) section.

## Default php.ini settings

The default values for some frequently-modified `php.ini` settings are listed below.

<dl>
<dt>memory_limit=128M</dt> <dd></dd>
<dt>post_max_size=64M</dt> <dd></dd>
<dt>upload_max_filesize=64M</dt> <dd></dd>
<dt>display_errors=On</dt> <dd>This value is on by default to ease setting up a project on Platform.sh. We strongly recommend providing a custom error handler in your application or setting this value to Off before you make your site live.</dd>
<dt>zend.assertions=-1</dt> <dd>Assertions are optimized out of existence and have no impact at runtime. You should have assertions set to `1` for your local development system.</dd>
<dt>opcache.memory_consumption=64</dt> <dd>This is the number of megabytes available for the opcache. Large applications with many files may want to increase this value.</dd>
<dt>opcache.validate_timestamps=On</dt> <dd>The opcache will check for updated files on disk. This is necessary to support applications that generate compiled PHP code from user configuration. If you are certain your application does not do so then you can disable this setting for a small performance boost.</dd>
</dl>

---

> **warning**
>
> We do not limit what you can put in your `php.ini` file, but many
> settings can break your application. This is a facility for advanced
> users.
