# Disaster recovery 

Platform.sh Enterprise provides four-hourly automated snapshots and nightly backups by default; a more regular backup schedule is available on request. Platform.sh Enterprise’s standard architecture splits site resources across three Amazon Availability Zones/datacenters (AZs). As a result the likelihood of DR scenarios is significantly reduced as this would entail three independent datacenters going down at the same time.

## Recovery from Failure on Platform Enterprise
Since everything is triple-redundant on Platform Enterprise, you can easily simulate failure by disconnecting one of the three servers from the cluster. This is an important operation that the Platform.sh team regularly tests, and Customer is welcome to participate in this test on their sites. Each Platform Enterprise cluster is designed to withstand the loss of an entire server and all of the services running on it. This was also described in the Current Answer.


## Recovery from Failure on Platform Standard
This is an automated process that is one of the key value-adds of Platform Standard. The coordinating agent that monitors Platform Standard detects failures at the service level (eg. MySQL failure), and for all cases where an automated recovery is possible, fully automates and coordinates that recovery. This is what was described in the Current Answer. This process cannot easily be tested by BC, but we can share logs with you to exemplify the process working in real life.
