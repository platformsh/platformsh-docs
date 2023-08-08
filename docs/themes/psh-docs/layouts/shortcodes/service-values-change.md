Note that the information about the relationship can change when an app is redeployed or restarted
or the relationship is changed.
So your apps should only rely on the `PLATFORM_RELATIONSHIPS` environment variable directly
(or through a [configuration reader](https://github.com/platformsh?q=config-reader&type=public))
rather than hard coding any values.
