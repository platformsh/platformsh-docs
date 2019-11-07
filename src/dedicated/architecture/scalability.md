# Scalability

Part of the original design goal of Platform.sh’s Triple Redundant Architecture was to ensure scalability in times of load spikes outside of the bounds of the original traffic specs.  Because the cluster is configured as an N+1 architecture, we can respond to legitimate traffic events by removing a node from the cluster, upsizing it, returning it into rotation, and then repeating the process on the next node in turn.

## Scaling Process and Procedure

The scaling process is not automatic and requires manual effort.  It may be initiated in two ways.

* On customer request via a ticket.  We strongly recommend notifying us ahead of time if you know a large traffic event is coming (a major product launch, Black Friday, etc.)  We cannot guarantee a turnaround time on a resizing unless given prior notice.
* High load incidents detected by our monitoring system.

If the load is diagnosed to be due to a bot or crawler that we are able to block, we will attempt to block it.  This prevents unnecessary scaling, which prevents unnecessary costs to you.  If it is not a bot or not blockable then we will begin the upscaling process detailed above.  Be advised that this process may take up to 60-90 minutes depending on the diagnostic steps needed.

We will open a support ticket to notify you of such changes, but we will not wait for your response before upscaling your cluster.  The uptime of your application is our top priority and reactive scaling events are part of how we ensure that we meet the obligations of our Service Level Agreement.

You may opt-out of the upsizing service if you wish, but outages caused by high-traffic will not be considered to violate the Service Level Agreement.
