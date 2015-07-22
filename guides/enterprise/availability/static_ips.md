# Static IP addresses

Because of Platform Enterprise’s unique triple-redundant setup, customers requiring Static IP addresses are provided with a set of three gateway servers, one for each availability zone. 
Most external services will allow you to whitelist multiple IPs, so having more than one fixed IP isn’t generally a problem.

These three gateways map to the three servers in your PE cluster at retain permanent addresses while the cluster servers will be assigned new ones on each reboot. The gateway server cost can be reduced by moving all three cluster servers into one AZ. In this case only one gateway is required. However, this reduces the overall resilience of the cluster as the site will go down if that AZ fails.