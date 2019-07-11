# PHP Support

<!-- toc -->

PHP is a popular scripting language designed especially for the web. It currently powers over 80% of websites.

## Supported versions

* 7.1
* 7.2
* 7.3

Note that as of PHP 7.1 we use the Zend Thread Safe (ZTS) version of PHP.

To select a PHP version, specify a `type` such as `php:7.3`:

```yaml
# .platform.app.yaml
type: "php:7.3"
```

## Deprecated versions

The following versions are available but are not receiving security updates from upstream, so their use is not recommended. They will be removed at some point in the future.

* 5.4
* 5.5
* 5.6
* 7.0

## Support libraries

While it is possible to read the environment directly from your application, it is generally easier and more robust to use the [`platformsh/config-reader`](https://github.com/platformsh/config-reader-php) Composer library which handles decoding of service credential information for you.

## Alternate start commands

PHP is most commonly run in a CGI mode, using PHP-FPM. That is the default on Platform.sh. However, you can also start alternative processes if desired, such as if you're running an Async PHP daemon, a thread-based worker process, etc. To do so, simply specify an alternative start command in `platform.app.yaml`, similar to the following:

```yaml
web:
    commands:
        start: php run.php
    upstream:
            socket_family: tcp
            protocol: http
```

The above configuration will execute the `run.php` script in the application root when the container starts using the PHP-CLI SAPI, just before the deploy hook runs, but will *not* launch PHP-FPM. It will also tell the front-controller (Nginx) to connect to your application via a TCP socket, which will be specified in the `PORT` environment variable. Note that the start command _must_ run in the foreground.

If not specified, the effective default start command varies by PHP version:

* On PHP 5.x, it's `/usr/sbin/php5-fpm`.
* On PHP 7.0, it's `/usr/sbin/php-fpm7.0`.
* On PHP 7.1, it's `/usr/sbin/php-fpm7.1-zts`.
* On PHP 7.2, it's `/usr/sbin/php-fpm7.2-zts`.
* On PHP 7.3, it's `/usr/sbin/php-fpm7.3-zts`.

While you can call it manually that is generally not necessary. Note that PHP-FPM cannot run simultaneously along with another persistent process (such as ReactPHP or Amp). If you need both they will have to run in separate containers.

## Expanded dependencies

In addition to the standard `dependencies` format, it is also possible to specify alternative repositories for use by Composer.  The standard format like so:

```yaml
dependencies:
    php:
        "platformsh/client": "dev-master"
```

is equivalent to `composer require platform/client dev-master`.  However, you can also specify explicit `require` and `repositories` blocks:

```yaml
dependencies:
    php:
        require:
            "platformsh/client": "dev-master"
        repositories:
            - type: vcs
              url: "git@github.com:platformsh/platformsh-client-php.git"
```

That would install `platformsh/client` from the alternate repository specified, as a global dependency.  That is, it is equivalent to the following `composer.json` file:

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url":  "git@github.com:platformsh/platformsh-client-php.git"
        }
    ],
    "require": {
        "platformsh/client": "dev-master"
    }
}
```

That allows you to install a forked version of a global dependency from a custom repository.

## Debug PHP-FPM

If you want to inspect what's going on with PHP-FPM, you can install this [small CLI](https://github.com/wizaplace/php-fpm-status-cli):

```yaml
dependencies:
  php:
    wizaplace/php-fpm-status-cli: "^1.0"
```

Then when you are connected to your project over SSH you can run:

```shell
$ php-fpm-status --socket=unix://$SOCKET --path=/-/status --full
```

## Accessing services

To access various [services](/configuration/services.md) with PHP, see the following examples.  The individual service pages have more information on configuring each service.

{% codetabs name="Elasticsearch", type="php", url="https://examples.docs.platform.sh/php/elasticsearch" -%}

{% language name="Memcached", type="php", url="https://examples.docs.platform.sh/php/memcached" -%}

{% language name="MongoDB", type="php", url="https://examples.docs.platform.sh/php/mongodb" -%}

{% language name="MySQL", type="php", url="https://examples.docs.platform.sh/php/mysql" -%}

{% language name="PostgreSQL", type="php", url="https://examples.docs.platform.sh/php/postgresql" -%}

{% language name="RabbitMQ", type="php", url="https://examples.docs.platform.sh/php/rabbitmq" -%}

{% language name="Redis", type="php", url="https://examples.docs.platform.sh/php/redis" -%}

{% language name="Solr", type="php", url="https://examples.docs.platform.sh/php/solr" -%}

{%- endcodetabs %}

## Runtime configuration

It is possible to change the PHP-FPM runtime configuration via the `runtime` block on your `.platform.app.yaml`. The PHP-FPM options below are configurable:

* `request_terminate_timeout` - The timeout for serving a single request after which the PHP-FPM worker process will be killed.  That is separate from the PHP runtime's `max_execution_time` ini option, which is preferred.  This option may be used if the PHP process is dying without cleaning up properly and causing the FPM process to hang.

```yaml
runtime:
    request_terminate_timeout: 300
```

## Project templates

A number of project templates for major PHP applications are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

### Applications

* [EZ Platform](https://github.com/platformsh/platformsh-example-ezplatform)
* [Drupal 7](https://github.com/platformsh/template-drupal7)
* [Drupal 7 Commerce Kickstart](https://github.com/platformsh/platformsh-example-drupalcommerce7)
* [Drupal 8](https://github.com/platformsh/template-drupal8)
* [Drupal 8 (Multisite variant)](https://github.com/platformsh/platformsh-example-drupal8-multisite)
* [Laravel](https://github.com/platformsh/template-laravel)
* [Moodle](https://github.com/platformsh/platformsh-example-moodle)
* [Magento 1](https://github.com/platformsh/platformsh-example-magento1)
* [Magento 2](https://github.com/platformsh/template-magento2ce)
* [Sculpin](https://github.com/platformsh/platformsh-example-sculpin)
* [TYPO3](https://github.com/platformsh/platformsh-example-typo3)
* [WordPress](https://github.com/platformsh/template-wordpress)
* [GravCMS](https://github.com/platformsh/platformsh-example-gravcms)

### Frameworks

* [Amp/Aerys](https://github.com/platformsh/platformsh-example-amphp)
* [React PHP](https://github.com/platformsh/platformsh-example-reactphp)
* [Symfony 3.x](https://github.com/platformsh/template-symfony3)
* [Symfony 4.x](https://github.com/platformsh/template-symfony4)
