# eZ Platform

eZ Systems provides documentation for eZ Platform, including how to optimize it for Platform.sh, in their [official documentation](https://doc.ezplatform.com).

## Cache and sessions

On Platform.sh Enterprise by default we recommend using two separate Redis instances, one for Cache and one for Sessions.  The service and relationship names that ship with the default Platform.sh configuration in eZ Platform should be used as-is.  To ensure the development environment works like Production, uncomment the `redissession` entry in the `.platform/services.yaml` file and the corresponding relationship in the `.platform.app.yaml` file.  The bridge code that is provided with eZ Platform 1.13 and later will automatically detect the additional Redis service and use it for session storage.

By default we will configure both Cache and Session storage in "persistent" mode, so that data is not lost in case of a system or process restart.  That reduces the potential for cache stampede issues or inadvertently logging people out.
