# Cron timezone

All Platform.sh containers default to running in UTC time.  Applications and application runtimes may elect to use a different timezone but the container itself runs in UTC.  That includes the `spec` parameter for cron tasks that  

That is generally fine but sometimes it's necessary to run cron tasks in a different timezone.

## Setting the system timezone for cron tasks

The `timezone` property sets the timezone for which the `spec` property of any [cron tasks](/configuration/app/cron.md) defined by the application will be interpreted.  Its value is one of the [tz database region codes](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) such as `Europe/Paris` or `America/New_York`.  In most cases it's more self-descriptive to set the timezone on the cron task itself, however.

## Setting an application runtime timezone

The application runtime timezone can also be set, although the mechanism varies a bit by the runtime.

* PHP runtime - You can change the timezone by providing a [custom php.ini](https://docs.platform.sh/user_guide/reference/toolstacks/php/configure-php.html#custom-php-ini).
* Node.js runtime - You can change the timezone by starting the server with `env TZ='<timezone>' node server.js`.
* Python runtime - You can change the timezone by starting the server with `env TZ='<timezone>' python server.py`.

Setting the application timezone will only affect the application itself, not system operations such as log files.

> **note**
> In the vast majority of cases it's best to leave all timezones in UTC and store user data with an associated timezone instead.
