# Variables

All of the [environment variables](https://docs.platform.sh/development/variables.html#platformsh-provided-variables) defined on Platform.sh Professional are available on Platform.sh Enterprise as well, and function the same.

Additionally, the following environment variables are defined on an Enterprise cluster.  They may be used in a deploy hook, for instance, to execute certain tasks only when running on an Enterprise cluster.

* **PLATFORM_MODE**: Set to `enterprise` in an Enterprise environment (both production and staging).
* **PLATFORM_CLUSTER**: Set to the cluster ID.
* **PLATFORM_PROJECT**: Set to the document root.  This is typically the same as your cluster name for the production environment, while staging will have `_stg` or similar appended.

## How can I have a script behave differently on the cluster than on development?

The following sample shell script will output a different value on the Enterprise cluster than the Development environment.

```bash
if [ "$PLATFORM_MODE" = "enterprise" ] ; then
    echo "Hello from the Enterprise"
else
    echo "We're on Development"
fi
```

## How can I have a script behave differently on Production and Staging?

In most Enterprise configurations the the production branch is named `production` (whereas it is always `master` on Platform.sh Professional).  The following test therefore should work in almost all cases:

```bash
if [ "$PLATFORM_MODE" = "enterprise" ] ; then
    if [ "$PLATFORM_BRANCH" = "production" ] ; then
        echo "This is live on production"
    else
        echo "This is staging staging"
    fi
else
    echo "We're on Development"
fi
```
