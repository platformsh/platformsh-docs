# Scalability

Platform Enterprise can seamlessly scale from the smallest 6 CPU cluster with 11.25GB RAM to the largest 96 CPU cluster with 180GB RAM. Platform’s triple-redundant architecture means that upscaling can be conducted swiftly and without downtime: each of the three instances in the cluster is taken out of rotation in turn, upgraded to the new size and returned to rotation.
 
In addition, extra web servers can be added to an existing cluster should the constriction be at the PHP level rather than the database level. This provides “horizontal scaling”, to complement the “vertical scaling” provided by extra CPUs on the DB level. 

![Platform Enterprise Overview](/images/scaling.png)
Figure: Platform Enterprise Scaling