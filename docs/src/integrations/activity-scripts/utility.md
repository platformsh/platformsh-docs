---
title: "Utility routines"
sidebarTitle: "Utility routines"
weight: -10
description: |
    The following utility routines can help simplify common tasks in your activity scripts.  They are free to copy, modify, bend, fold, spindle, and mutilate as needed for your own scripts.  They also demonstrate some common patterns for working with the `activity` and `project` data structures in ES5 code.
---

{{< description >}}

## General utilities

```javascript
/**
 * Formats a string, injecting values in for placeholders.
 *
 * @param {string} format
 *   A format string with placeholders in the form {0}, {1}, etc.
 * @param {string} args
 *   A variable number of strings to replace by position.
 * @return {string}
 *   The formatted string.
 */
function formatString (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
}
```

```javascript
/**
 * Returns a key/value object containing all variables relevant for the activity.
 *
 * That includes project level variables, plus any variables visible for
 * the relevant environment for the activity, if any.
 *
 * Note that JSON-encoded values will show up as a string, and need to be
 * decoded with JSON.parse().
 */
function variables() {
    var vars = {};
    activity.payload.deployment.variables.forEach(function(variable) {
        vars[variable.name] = variable.value;
    });

    return vars;
}
```


## Route access

```javascript
/**
 * Returns just those routes that point to a valid upstream.
 *
 * This method is similar to routes(), but filters out redirect routes that are rarely
 * useful for app configuration.  If desired it can also filter to just those routes
 * whose upstream is a given application name.  To retrieve routes that point to the
 * current application where the code is being run, use:
 *
 * routes =  getUpstreamRoutes(applicationName);
 *
 * @param {string|null} appName
 *   The name of the upstream app on which to filter, if any.
 * @return {object}
 *   An object map of route definitions.
 */
function getUpstreamRoutes(appName) {
    var upstreams = {};
    Object.keys(activity.payload.deployment.routes).forEach(function (url) {
        var route = activity.payload.deployment.routes[url];
        if (route.type === "upstream") {
            if (!appName || appName === route.upstream.split(':')[0]) {
                route.url = url;
                upstreams[url] = route;
            }
        }
    });
    return upstreams;
}
```

```javascript
/**
 * Returns the primary route.
 *
 * The primary route is the one marked primary in `routes.yaml`, or else
 * the first non-redirect route in that file if none are marked.
 *
 * @return {object}
 *   The route definition.  The generated URL of the route is added as a "url" key.
 */
function getPrimaryRoute() {
    var primary = {};
    Object.keys(activity.payload.deployment.routes).forEach(function (url) {
        var route = activity.payload.deployment.routes[url];
        if (route.primary) {
            route.url = url;
            primary = route;
        }
    });
    return primary;
}
```

```javascript
/**
 * Returns a single route definition.
 *
 * Note: If no route ID was specified in routes.yaml then it will not be possible
 * to look up a route by ID.
 *
 * @param {string} id
 *   The ID of the route to load.
 * @return {object}
 *   The route definition.  The generated URL of the route is added as a "url" key.
 * @throws {Error}
 *   If there is no route by that ID, an exception is thrown.
 */
function getRoute(id) {
    var found = null;
    Object.keys(activity.payload.deployment.routes).forEach(function (url) {
        var route = activity.payload.deployment.routes[url];
        if (route.id === id) {
            route.url = url;
            found = route;
        }
    });

    if (found) {
        return found;
    }
    throw new Error("No such route id found: " + id);
}
```
