# Platform.sh Enterprise

Platform.sh Enterprise is a robust, redundant layer on top of Platform.sh Professional.  It is well-suited for those who like the Platform.sh development experience but need more resources and redundancy for their production environment.

Platform.sh Enterprise consists of two parts: The Development Environment and the Enterprise Cluster.  

### The Development Environment

The Development Environment is a normal [Platform.sh Professional](https://docs.platform.sh/) account, with all of the capabilities and workflows of Platform.sh Professional.  The one difference is that the master branch will not be associated with a domain and thus will never be "production".  The [Platform.sh Professional Documentation](https://docs.platform.sh/) has more information on how to best leverage it.

### The Enterprise Cluster

The Enterprise Cluster is a three-Virtual Machine redundant configuration provisioned by Platform.sh for each customer.  Every service is replicated across all three virtual machines in a failover configuration (as opposed to sharding), allowing a site to remain up even if one of the VMs is lost entirely.

The build process for your application is identical for both the Development Environment and the Enterprise Cluster.  However, because the VMs are provisioned by Platform.sh, not as a container, service configuration must be done by Platform.sh's Customer Success team.  By and large the same flexibility is available but only via filing a support ticket.
