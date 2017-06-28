# System timezone

All Platform.sh containers default to running in UTC time.  Applications and application runtimes may elect to use a different timezone but the container itself runs in UTC.  That is usually fine and a correct configuration but occasionally there is cause to run the server in a specific timezone.

## Setting the system timezone

The system timezone for any service or app container may be set with the `timezone` property, whose value is one of the [tz database region codes](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) such as `Europe/Paris` or `America/New_York`.

> **warning**
> Note that setting the timezone of different services differently may result in date mismatches between different services and thus is not recommended.

## Setting an application runtime timezone

The application runtime timezone can also be set, although the mechanism varies a bit by the runtime.

* PHP runtime - You can change the timezone by providing a [custom php.ini](https://docs.platform.sh/user_guide/reference/toolstacks/php/configure-php.html#custom-php-ini).
* Node.js runtime - You can change the timezone by starting the server with `env TZ='<timezone>' node server.js`.
* Python runtime - You can change the timezone by starting the server with `env TZ='<timezone>' python server.py`.

Setting the application timezone will only affect the application itself, not system operations such as log files.

> **note**
> In the vast majority of cases it's best to leave all timezones in UTC and store user data with an associated timezone instead.
