# Platform.sh services

Each Platform.sh project or "platform" as we call it sometimes is composed of
one or more applications (configured through `.platform.app.yaml`) and zero or
more services. Those services are defined and configured in a configuration file
called [.platform/services.yaml](../../user_guide/reference/services-yaml.html)).

Services are common to the whole project but you can configure for each
application in its `.platform.app.yaml` how this service will be called, and
whether or not it should be available. Unlike other cloud hosting services
these are not external add-ons: they run on the same infrastructure. So a
cluster backup contains all the data from all the services.

And when you clone a project you get everything in a consistent state.

We add new services, and new service versions all the time...
