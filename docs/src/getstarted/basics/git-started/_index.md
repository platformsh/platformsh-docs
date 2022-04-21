---
title: "Introduction"
sidebarTitle: "What is Platform.sh?"
weight: 1
layout: single
description: |
  Learn the basics of Platform.sh, and how it helps solve some of the most common DevOps problems.
---

## A note on DevOps

If you're working on a production website today, you have likely encountered the concept of DevOps, which has grown as a philosophy to help resolve recurring struggles that come with deploying, maintaining, and testing production web sites. 
By adopting the DevOps [process, tools, and culture](https://azure.microsoft.com/en-us/overview/what-is-devops), it promises applications and workflows that are consistent, collaborative, and secure.

It assumes that your website is hosted somewhere - most likely in the cloud - and then it is up to your team to select the tools you will need to embody its principles. 
Whatever you choose, that combination will need to enable your team to deploy specific services (i.e. databases, runtimes) with specific versions consistently. 

If an important security patch is released, your team should be able to reliably upgrade production to the latest version. 
Every change, inluding security patches, should be thoroughly tested prior to merging in an isolated environment that is as close to production as possible (i.e. dedicated staging).
That means identical code, identical infrastructure, and most importantly real production data. 

There are, as you can imagine, a great number of tools in this space meant to solve parts of these problems. 
The problem is, gaining the experience to do all of these things requires time. 
You will likely need to hire a dedicated person (the DevOps engineer) who has the experience to develop an in-house system to orchestrate it all.
This person will spend the majority of their time provisioning infrastructure, and providing environments other developers can actually work from. 
They will be expensive, and a liability to lose. 

Training other team members means the same thing - time to gain expertise, and time not spent developing the actual application. 
But part of the DevOps philosophy implies cultural adoption. 
That is, DevOps really is intended to be intuitive and ingrained enough in the work for every member of the team to do it consistently.

And yet, without some kind of abstraction, the cost is often too high to actually execute that. 

## What is Platform.sh?

Platform.sh is, in part, a Platform-as-a-Service provider.
It aims to provide a simple abstraction to allow development teams to abide by DevOps principles in their day-to-day work by removing the expertise required to do it. 
It's API is Git, which you are likely already using, and then it leverages that protocol to make common tasks like commits, branches, and merges into the primary mechanisms for provisioning infrastructure and staging environments. 

Every branch or pull request automatically becomes a staging environment - complete with exact copies of production infrastructure _and_ production data. 
While you may chose other tools to enforce other DevOps best practices (continuous integration, for example), by using Git your site already has everything it needs to produce these kinds of envrionments regularly, consistently, and securely with Platform.sh.  

Platform.sh is built around the idea of **iterative development**.
Since the creation of development environments is the same as branching, and since every branch, no matter its parent, inherits code & data the same way, you can experiment freely with any new feature.
You can make small changes in isolation, and merge them into production very quickly and with a high-level of confidence. 
On the other hand, if that experiment doesn't work out, there's no problem deleting the environment and moving onto the next task. 

At this point, it will be most helpful to go through an example.
Once you have a chance to use Platform.sh, you'll have a much better picture of how it's useful in solving these common problems. 
In this guide you will deploy an application, and experiment with new changes in an isolated development environment. 
After that, you will get a chance to investigate exactly how Platform.sh handles builds and merges. 

{{< guide-buttons next="Deploy your first project" type="first" >}}
