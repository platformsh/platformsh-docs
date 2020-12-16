---
title: "How to Deploy Gatsby on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Gatsby.
---

Gatsby is an open source framework based on React, that specializes in generating static websites from a variety of content sources. 

Going through the steps below you will have two options:

1. You already have a Gatsby site you are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [Gatsby template](https://github.com/platformsh-templates/gatsby) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base Gatsby project.

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="Gatsby" template="gatsby" >}}

```bash
$ git clone https://github.com/gatsbyjs/gatsby-starter-blog.git
```

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
