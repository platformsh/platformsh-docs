# PHP 7

PHP 7 is the next major version of PHP. It not only brings new language
features, but it also sports huge performance boosts over the 5.x generation. On
many workloads it is on-par with HHVM.

Our performance tests with Drupal 8.0 and PHP 7.0 yielded 2X performance gains
compared with PHP 5.6!

To your joy, you may also discover that it has a much lower memory footprint
than both PHP 5.6 and HHVM, so in some cases it may outperform both by a margin.

On the other hand, some extensions have not yet been ported to PHP 7.0, so we
can only provide beta level support for now. We may not be able to help in case of
site-specific issues related to this. We don't recommend upgrading your
production sites to PHP 7 without thorough testing. If an extension you use is
missing, there may or may not be a pure PHP replacement for it, such as Predis
for redis.

To switch your project to PHP 7, put `php:7.0` instead of `php` or `php:5.6` in
the `type` property of your `.platform.app.yaml`.

Example:

```yaml
    name: "fastapp"
    type: php:7.0
    build:
        flavor: composer
    web:
      document_root: "/"
      passthru: "/index.php"
    disk: 2048
```
