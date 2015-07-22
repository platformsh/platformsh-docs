# Security Governance

[//]: # (TODO: Security operations center)

## Security incident response
Platform.sh subscribes to all relevant security lists for Platform.sh Enterprise elements. The complete stack is kept up to date with all security updates via the Debian security channel. 
Once a vulnerability has been detected, a standardised process is followed: 
the Security Team meets to identify all clients affected; 
the order in which patches will be applied is prioritised based on need; 
customers are proactively informed of the upcoming patch via a ticket; 
the patch is applied to a staging environment and tested; 
once the patched site has passed all requisite tests the patch is applied to the live environment and the customer is informed of the successful patching.
Should a customer report a vulnerability the same process is also followed. 

## Security for customer confidential information

### Application
All operations are automated in Platform.sh Enterprise. Individual instances and clusters are brought online and connected programmatically, without the need for a system administrator to connect each machine to its destination cluster. This reduces the scope for human error, the leading cause of security flaws.
All requests to the system are logged and stored in a dedicated S3 bucket.
Cluster-internal instances log applications locally as standard. Customers can request access to logs via a standard ticket.
Furthermore:
- The Platform.sh team never accesses customer data directly
- Options exist for encrypting data at rest: volume encryption and database field encryption
- Data is encrypted in transit via HTTPS/SSL

### Operational
Platform.sh logs all operational activity, centralizes log management, basing operational alerts and monitoring on automated triggers. These use Munin, Nagios, Logstash, Kibana, and Elasticsearch among others.

### Employee Access to customer information
Only a very small and select group of direct employees on the operations team has any access to the customer database. 
Data is never accessed directly by the service operations team, nor is it moved, for any reason, without prior consent. However, the subset of super admins who are at the highest privilege level for operations would theoretically have visibility on stored data. For example, a super admin on the server on which customer data is stored would be able to see file names of images uploaded to Drupal, and is able to exert administrator level operations on them. Highest privilege sysadmins are also able to initiate database connections to the customer database. This is a usual situation with the operating environment.   
Our offering is based on a standard set of processes and controls to enable skilled staff the access they require in the maintenance of application and hosting provision. We take security very seriously and staff undergo a rigorous selection process, and are continuously monitored and trained. Senior management review processes and spot check adherence.

[//]: # (TODO: Personnel security)

[//]: # (TODO: Security training)

## Internal audits 
As a relative newcomer to the Cloud Services space, Platform.sh has not yet undergone  auditing and certification as described. We are in the process of planning these steps currently.