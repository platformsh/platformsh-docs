# eZ Platform

eZ Platform is a Composer-based PHP CMS, and as such fits well with the Platform.sh model.  As a Symfony-based application its setup is very similar to Symfony.

eZ Platform comes pre-configured for use with Platform.sh in version 1.13 and later and version 2.0.1 and later.  Those are the only versions that are supported.  Appropriate Platform.sh configuration files are included in the eZ Platform application itself, but of course may be modified to suit your particular site if needed.

## Cache and sessions

By default, eZ Platform is configured to use a single Redis instance for both the application cache and session storage.  You may optionally choose to use a separate Redis instance for session storage in case you have a lot of authenticated traffic (and thus there would be many session records).

To do so, uncomment the `redissession` entry in the `.platform/services.yaml` file and the corresponding relationship in the `.platform.app.yaml` file.  The bridge code that is provided with eZ Platform 1.13 and later will automatically detect the additional Redis service and use it for session storage.

## Symfony build mode

By default, eZ Platform will be build and run in production mode.  That means, for instance, Composer development dependencies will be skipped.  In most cases that is desireable.

If for one reason or another you wish eZ Platform to build and run in development mode then you will need to set a project-level variable so that it is accessible at build time.  From your local checkout, run:

```bash
platform project:variable:set env:SYMFONY_ENV dev
```

That will change *all* environments (as of their next build and deploy) to use dev mode, including production.  To switch back to production mode, either set that variable to `prod` or delete it outright:

```bash
platform project:variable:delete env:SYMFONY_ENV
```

## Modifying an existing eZ Platform project

If you have an existing eZ Platform project that was upgraded from a previous version, or want to resynchronize with the latest recommended configuration, please see the [eZ Platform official repository](https://github.com/ezsystems/ezplatform).

In particular, see:
 
 * The [.platform.app.yaml](https://github.com/ezsystems/ezplatform/blob/master/.platform.app.yaml) file, which automatically builds eZ Platform in dev mode or production mode depending on your defined project-level variables.
 * The [.platform](https://github.com/ezsystems/ezplatform/tree/master/.platform) directory
 * The [platformsh.php](https://github.com/ezsystems/ezplatform/blob/master/app/config/env/platformsh.php) configuration file, which does the work of mapping Platform.sh environment variables into eZ Platform.  It also will automatically enable Redis-based cache and session support if detected.
