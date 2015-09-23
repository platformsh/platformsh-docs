#HHVM Beta Support

HHVM is an open-source virtual machine designed for executing programs written in Hack and PHP. HHVM uses a just-in-time (JIT) compilation approach to achieve superior performance while maintaining the development flexibility that PHP provides.


Simply, in the `type` property of your `.platform.app.yaml` put `hhvm` instead of `php`

Example:

```yaml
    name: "fastapp"
    type: hhvm
    build:
        flavor: composer
    web:
      document_root: "/"
      passthru: "/index.php"
    disk: 2048
```