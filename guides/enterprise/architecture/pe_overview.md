#General overview of Platform.sh Enterprise

Platform.sh is an end-to-end, development to production PaaS that provides efficiency, productivity and testability gains in development  and stability, scalability and robustness in production. Platform.sh leverages cutting-edge container technology and fully realizes the power of Git in the cloud, making development, deployment and production massively iterable with a revolutionary code-driven infrastructure approach. 

Redundancy for Enterprise customers is enabled through the site residing in a single AWS Region, distributed over three Availability Zones (AZs). You have your choice of AWS region which is settled at contract time, but is inclusive of all AWS Regions. The three AZs in a region are a minimum of 12 km apart, on separate flood plains, with redundant power and internet connections and independent backup generators, but are also connected with dedicated metro-grade fibre (as if they are all in the same rack). 



The diagram below provides a schematic overview of Platform.sh Enterprise’s overall architecture:

![Platform Enterprise Overview](/images/pl_ent.png)

Figure: Platform Enterprise Architecture

1. DNS: Route 53 ALIAS records maps zone apex to Cloudfront distribution. Other DNS providers such as DNS Made Easy also provide this functionality. (For more information see: http://aws.amazon.com/route53)
2. CDN: (Cloudfront or Fastly) caches popular resources at edge locations. HTTPS terminates here. (For more information see: http://aws.amazon.com/cloudfront)
3. Health check: Load Balancer performs health check on instances.
4. Load Balancer distributes traffic
5. Nginx performs proxy caching, compression, and passes requests to Drupal running in PHP-FPM.						
6. Load balancing of DB queries pushes writes to one Master, compensating for optimistic locking. All three DB instances are synchronous Masters; LB provides health check and elects new write master in case of failure. Platform.sh Enterprise runs Maria DB 5.5. in a Galera Cluster.
7. Unlike many other Cloud providers, Platform.sh Enterprise runs comes in a three-server configuration as standard. This provides a significant advance in robustness and availability over conventional tow-server failover models. By further splitting site resources over three discreet Availability Zones (AZs)/data centers, the site can survive complete failure of any single datacenter, and data consistency is guaranteed.
8. From its standard configuration of three instances, Platform.sh Enterprise can scale out on the web tier to as many instances as might be required for very heavy traffic and highly transactional sites. 
