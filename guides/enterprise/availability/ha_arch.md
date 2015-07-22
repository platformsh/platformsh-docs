# High availability architecture 
Unlike many other Cloud providers, Platform.sh Enterprise comes in a three-server configuration as standard. This provides a significant advance in robustness and availability over conventional two-server failover models. By further splitting site resources over three discrete Availability Zones (AZs)/data centers, the site can survive complete failure of any single datacenter, and data consistency is guaranteed. 

##Triple-redundant multimaster
Rather than running a traditional active-passive master or master-slave setup, Platform.sh Enterprise runs a triple-redundant multimaster where all three instances accept reads and writes. Based on the Galera cluster, this architecture offers zero downtime when scaling, and guaranteed transactional integrity. 

##Redundant at all levels of the stack
Furthermore, Platform.sh Enterprise is fully redundant and highly available at every level of the stack, from DNS through CDN, ELB and the standard 3-server cluster comprising Nginx, PHP, MariaDB and Apache Solr.