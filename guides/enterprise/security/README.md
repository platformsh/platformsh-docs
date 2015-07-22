# Security

## Read-only architecture
As a result of Platform.sh Enterprise’s unique architecture, all services running in production are mounted on read-only partitions. Read/write mount points (e.g. files in the database) are explicitly identified, and easily auditable; and no program located there can be executed. This makes the majority of attacks very difficult.

## Service/process isolation
Processes in Platform are totally separated, with each process running in a separate LXC container (exactly as if each process running on a separate physical server). It is extremely difficult ( if not impossible) to use a flaw in one component to attack another.

## Code-driven infrastructure
Platform.sh builds the complete server environment on each Git commit, with services (e.g. PHP, MySQL, Solr etc.) defined in simple YAML files that reside in the Git repository. As a result, the infrastructure is kept to the absolute functional minimum, with no unnecessary services or daemons running. 

## Network isolation
Platform.sh Enterprise uses a cluster dedicated to each virtual network. It is impossible to connect from one cluster to another. IP services are on a non-routable range, so it is impossible to connect to a container other than the "Gateway". The gateway only permits three services: HTTP, HTTPS and SSH (ports 80, 443, and 22). Thus each cluster is in a DMZ beyond a double Firewall (with Amazon protecting the Gateway, and the Gateway protecting the clusters). 
Servers are only accessible via SSH and git/ssh access to the servers. SSH users access by adding their public key via the Platform.sh UI. Access rights are highly granular and assigned per environment.  

## Static Security Checks
On deployment Platform runs static security checks on some highly critical vulnerabilities and will fail the deployment if those are included. The security checks are signature based. For example if a user pushes a Drupal installation that is vulnerable to CVE-2014-3704 the deployment will stop and the developer notified.
These are not end-to-end tests but designed not to interfere with development while catching some of the most dangerous and widespread vulnerabilities. When a new highly critical vulnerability is known the platform team proactively adds its signature.

## Encryption, key management, protection of data in transit
By default, key management is done by Platform.sh’s own identity and authentication management database. Only protocols supporting strong encryption are used for data transfer (https, scp, sftp, rsync). Upon request (add-on module) a FIPS-compliant enterprise key manager will be deployed to govern key access. This also opens the door to encrypted data at rest (at the volume level or individual database fields).

## Automation and Logging
APPLICATION: All operations are automated in Platform.sh Enterprise. Individual instances and clusters are brought online and connected programmatically, without the need for a system administrator to connect each machine to its destination cluster. This reduces the scope for human error, the leading cause of security flaws.
All requests to the system are logged and stored in a dedicated S3 bucket.
Cluster-internal instances log applications locally as standard. Customers can request access to logs via a standard ticket.

OPERATIONAL: Platform.sh logs all operational activity, centralizes log management, basing operational alerts and monitoring on automated triggers. These use Munin, Nagios, Logstash, Kibana, and Elasticsearch among others.

## Virtualization Security
Platform.sh utilizes tightly managed IAM Users, Groups, and Roles at the AWS level to govern user access. VM images are built and maintained by the Platform.sh team. OS-level Access is governed by key-based access and keys are managed in our central authentication database. Active data at rest (the data being used by the application) can be encrypted upon request (add-on module). Backup data at rest is encrypted by default.

### Virtual Machine destruction
Customer instances have no access to raw disk devices, but instead are presented with virtualized disks. The AWS proprietary disk virtualization layer automatically resets every block of storage used by the customer, so that one customer’s data is never unintentionally exposed to another. In addition, memory allocated to guests is scrubbed by the hypervisor when it is unallocated to a guest. The memory is not returned to the pool of free memory available for new allocations until the memory scrubbing is complete. AWS recommends customers further protect their data using appropriate means. One common solution is to run an encrypted file system on top of the virtualized disk device.

## Physical Security	
All Platform.sh Enterprise resources run in Amazon Web Services facilities. AWS’s data centers are state of the art, utilizing innovative architectural and engineering approaches. Amazon has many years of experience in designing, constructing, and operating large-scale data centers. This experience has been applied to the AWS platform and infrastructure. AWS data centers are housed in nondescript facilities. Physical access is strictly controlled both at the perimeter and at building ingress points by professional security staff utilizing video surveillance, intrusion detection systems, and other electronic means. Authorized staff must pass two-factor authentication a minimum of two times to access data center floors. All visitors and contractors are required to present identification and are signed in and continually escorted by authorized staff. 

### Physical media destruction
Platform.sh only holds customer data and resources in AWS facilities (see Customer confidential Data ). 
When a storage device has reached the end of its useful life, AWS procedures include a decommissioning process that is designed to prevent customer data from being exposed to unauthorized individuals. AWS uses the techniques detailed in DoD 5220.22-M (“National Industrial Security Program Operating Manual “) or NIST 800-88 (“Guidelines for Media Sanitization”) to destroy data as part of the decommissioning process. All decommissioned magnetic storage devices are degaussed and physically destroyed in accordance with industry-standard practices.

## Systems Access Controls

### System Access and Authentication
Identity and authentication is managed by a central database which enforces Two Factor Authentication (TFA) for Platform.sh personnel. TFA can be mandated by customer for customer access. The protocol used is OAUTH2 + OpenID Connect. An additional layer of access is governed by public/private key pairs; any developer wishing to push code to Git or open an SSH session must posess the proper private key. 

### Physical access
AWS only provides data center access and information to employees and contractors who have a legitimate business need for such privileges. When an employee no longer has a business need for these privileges, his or her access is immediately revoked, even if they continue to be an employee of Amazon or Amazon Web Services. All physical access to data centers by AWS employees is logged and audited routinely.

## Stack patch management 
Platform.sh subscribes to all relevant security lists for Platform.sh Enterprise elements. The complete stack is kept up to date with all security updates via the Debian security channel. 

Platform.sh maintains its own apt-get repository. No updates are included without vetting and approval by Platform.sh.

## Antivirus
If required, for example where customers or site users are uploading files to the server, customers can request to have ClamAV installed on their cluster via a standard ticket. 
ClamAV is an open source antivirus engine for detecting trojans, viruses, malware & other malicious threats.

## Customer Initiated Penetration Testing
Platform.sh encourages vulnerability assessments (“penetration testing”) initiated by the customer and at customer’s expense. Customer vulnerability scans may only be run against the site which the customer owns in order that the test does not impact other customer sites. The Platform.sh support team must be provided two days notice and the source IP addresses of the vulnerability scanner before such tests. Customers should initiate this process with a support ticket. The possibility exists that our monitoring will generate critical alerts if certain conditions are met simulating a brute-force attack, port scanning, or similar penetration testing technique.

## File System encryption
Platform.sh partners with Townsend Security for keystore and DB encryption. 

## Keystore encryption
Proper protection of encrypted or tokenized data requires the right key management solution. Alliance Key Manager from Townsend provides a FIPS-140 certified solution to provably meet industry standards for key management. Alliance Key Manage is an affordable key management solution for end customers and ISV/OEM customers.

## DB Encryption
Alliance AES Encryption solutions from Townsend Security let you protect information in databases at the column level on a wide variety of platforms including MySQL and other database applications. Data is protected with NIST-certified AES encryption solutions to insure compliance with all relevant regulations.

## SSL & HTTPS
All sites on Platform.sh Enterprise must use SSL. New or existing SSL certificates can be installed on Platform.sh Enterprise via a standard support ticket.

##Customer confidential Data
Platform.sh ensures that customer confidential data stays on AWS infrastructure and is only held outside of AWS for short periods of time when this is necessary in order to solve an issue or debug a problem connected with the data. Customer data is never stored on thumb drives or optical storage.
 
## Data Loss and Theft Prevention
The first layer of defense is Platform.sh’s excellent security model is based on Principle of least privilege, TFA, and key-based access to data-storing systems. Beyond that, additional security and privilege levels can be requested by the customer by implementing enterprise key management and encryption of data at rest.

// Latency and Network Peering
// **to do**

## Network security and Virtual Private Network (VPN) 
Outgoing VPN is supported on-demand, and can be enabled by a support ticket. We also support most of the IPSec-based VPNs, as long as they are in "road warrior" mode. We do not support (and do not intend to support) net-to-net VPNs. Platform.sh Standard VPN support is a free, self-service offering. On Platform.sh Enterprise support requires PS effort and is charged based on T&M. 

## Firewalls
Only access via http, https and ssh (ports 80, 443 and 22). Communication between instances in the cluster is also firewalled.
## Web Application Firewall (WAF) 
Platform Enterprise runs Amazon Cloudfront, which does not have a built-in Web Application Firewall (WAF).  
Through the use of a WAF, traffic that could exploit potential site vulnerabilities is blocked from reaching the origin. Platform.sh believe that the best way to deal with this is to prevent the vulnerabilities themselves by adopting best practices in terms of secure coding and conducting regular security testing. 
See www.theregister.co.uk/2014/08/21/amazon_flicks_switch_on_cloudfront_security_features/

## Denial of Service (DOS) and Distributed Denial of Service (DDOS) attacks 
Customers requiring DDOS protection are advised to use Cloudflare. See: https://www.cloudflare.com/ddos