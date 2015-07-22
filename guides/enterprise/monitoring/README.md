# Monitoring and Support 

## Internal monitoring

All Platform.sh Enterprise systems are monitored via Nagios and Munin. 
Nagios measures 15 site metrics in order to monitor site health, including: web server status, load balancer status, DB cluster status, DB flow control status, zombie processes, disk free space and zookeeper status. 

### Alerts
Nagios alters Platform.sh Enterprise operations staff via email and smartphone alerts based on predefined thresholds for all critical metrics.

##Security monitoring 
The Platform.sh service has a protective blocking feature that, under certain circumstances, restricts access to web sites with security vulnerabilities. We use this partial blocking method to prevent exploitation of known security vulnerabilities. See: https://docs.platform.sh/protective-block/

## Infrastructure monitoring					
Underlying  infrastructure monitoring is provided by AWS. AWS utilizes a wide variety of automated monitoring systems to provide a high level of service performance and availability. AWS monitoring tools are designed to detect unusual or unauthorized activities and conditions at ingress and egress communication points. These tools monitor server and network usage, port scanning activities, application usage, and unauthorized intrusion attempts. The tools have the ability to set custom performance metrics thresholds for unusual activity.					
Systems within AWS are extensively instrumented to monitor key operational metrics. Alarms are configured to automatically notify operations and management personnel when early warning thresholds are crossed on key operational metrics. An on-call schedule is used so personnel are always available to respond to operational issues. This includes a pager system so alarms are quickly and reliably communicated to operations personnel.
					
Documentation is maintained to aid and inform operations personnel in handling incidents or issues. If the resolution of an issue requires collaboration, a conferencing system is used which supports communication and logging capabilities. Trained call leaders facilitate communication and progress during the handling of operational issues that require collaboration. Post-mortems are convened after any significant operational issue, regardless of external impact, and Cause of Error (COE) documents are drafted so the root cause is captured and preventative actions are taken in the future. Implementation of the preventative measures is tracked during weekly operations meetings.
					
AWS security monitoring tools help identify several types of denial of service (DoS) attacks, including distributed, flooding, and software/logic attacks. When DoS attacks are identified, the AWS incident response process is initiated. In addition to the DoS prevention tools, redundant telecommunication providers at each region as well as additional capacity protect against the possibility of DoS attacks.
					
The AWS network provides significant protection against traditional network security issues, and you can implement further protection. The following are a few examples:					 							
- Distributed Denial Of Service (DDoS) Attacks. AWS API endpoints are hosted on large, Internet-scale, world- class infrastructure that benefits from the same engineering expertise that has built Amazon into the world’s largest online retailer. Proprietary DDoS mitigation techniques are used. Additionally, AWS’s networks are multi- homed across a number of providers to achieve Internet access diversity.					
- Man in the Middle (MITM) Attacks. All of the AWS APIs are available via SSL-protected endpoints which provide server authentication. Amazon EC2 AMIs automatically generate new SSH host certificates on first boot and log them to the instance’s console. You can then use the secure APIs to call the console and access the host certificates before logging into the instance for the first time. We encourage you to use SSL for all of your interactions with AWS.					 							
- IP Spoofing. Amazon EC2 instances cannot send spoofed network traffic. The AWS-controlled, host-based firewall infrastructure will not permit an instance to send traffic with a source IP or MAC address other than its own.	
- Port Scanning. Unauthorized port scans by Amazon EC2 customers are a violation of the AWS Acceptable Use Policy. Violations of the AWS Acceptable Use Policy are taken seriously, and every reported violation is investigated. Customers can report suspected abuse via the contacts available on our website at: http://aws.amazon.com/contact-us/report-abuse/. When unauthorized port scanning is detected by AWS, it is stopped and blocked. Port scans of Amazon EC2 instances are generally ineffective because, by default, all inbound ports on Amazon EC2 instances are closed and are only opened by you. Your strict management of security groups can further mitigate the threat of port scans. If you configure the security group to allow traffic from any source to a specific port, then that specific port will be vulnerable to a port scan. In these cases, you must use appropriate security measures to protect listening services that may be essential to their application from being discovered by an unauthorized port scan. For example, a web server must clearly have port 80 (HTTP) open to the world, and the administrator of this server is responsible for the security of the HTTP server software, such as Apache. You may request permission to conduct vulnerability scans as required to meet your specific compliance requirements. These scans must be limited to your own instances and must not violate the AWS Acceptable Use Policy. Advanced approval for these types of scans can be initiated by submitting a request via the website at: https://aws-portal.amazon.com/gp/aws/html-forms- controller/contactus/AWSSecurityPenTestRequest

## 24x7 Support 
Incidents on Platform.sh Enterprise that involve outages and other highly-impactful events will receive 24/7 support coverage if submitted as P1. Application support is only 24/7 for P1 if specified in your contractual agreement.

P1 incidents affect production environments and meet the following criteria with no possible workaround (this list is not exhaustive):
- needs an immediate response because it has a major impact
- results in down-time
- results in unacceptable load-times
- results in a loss of production data
- is a critical security update
- drastically reduces or prevents the ability of the development team to work
- prevents business-critical tasks from being completed

In the event that you should need 24/7 support and submit a P1 ticket, it will generate a notification to our on-call team rotation via cell phone; and to the support director if that person fails to acknowledge the issue within 1hr.

### Proactive Tickets
Customers are encouraged to file tickets for any platform-related issues that might be affecting them. The Platform.sh Enterprise Support and Operations team will also proactively file tickets informing customers of critical situations and requesting their action if required.