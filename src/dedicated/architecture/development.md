# Platform.sh Development environments

Platform.sh Enterprise customers will have a development environment for their project that consists of a Platform.sh Professional project, typically provisioned by the Platform.sh team to reflect the amount of storage in your Enterprise contract.  This environment will provide you with all the DevOps, Continuous Integration, Continuous Deployment, and other workflow tooling of the professional product, but will segregate the performance impacts from your production hardware.

## Architecture (Development Environments)

![Platform.sh Professional architecture](/images/PS-Arch-NoHA.svg)

## Default limits

The Development Environment for an Enterprise project provides a `production` and `staging` branch linked to the Enterprise Cluster, a `master` branch, and ten (10) additional active environments.  This number can be increased if needed for an additional fee.

The default storage for Enterprise contracts is 50GB per environment (production, staging, and each development environment) - this comprises total storage for your project and is inclusive of any databases, uploaded files, writable application logging directories, search index cores, and so on.  The storage amount for your development environment will reflect the amount in your enterprise contract.

A project may have up to six (6) users associated with it at no additional charge.  Additional users may be added for an additional fee.  These users will have access to both the Development Environment and the Enterprise Cluster.

## Larger developments environments

By default, all containers in development environments are "Small" sized, as they have limited traffic needs.  For more resource-intensive applications this size can be increased for an additional fee.
