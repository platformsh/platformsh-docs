---
title: "Create a new project"
weight: 2
toc: false
aliases:
  - "/gettingstarted/template/create-project.html"
---

In the previous step, you set up a free trial account with Platform.sh. Now you have access to the Platform.sh [Console](/administration/web/_index.md).

From here you can create projects, adjust account settings, and a lot more that you will explore throughout these Getting Started guides.

{{< video src="videos/management-console/new-project-creation.mp4" >}}

Since you do not yet have any projects on Platform.sh, the first thing you will see when you sign in is a workflow for creating a new project.

1. **Project type**

   You will first be given the option of creating a `New Project` that is empty ([one that you can migrate your own code base to](/gettingstarted/introduction/own-code/_index.md)), or to `Use a Template`. Select the `Use a Template` option, and then click `Next`.

2. **Details**

  Give your project a name like `My First Project`.

  In the next field, you have the option to configure the project's region, which corresponds with the data center where your project will live.  Select the region that most closely matches where most of your traffic will come from and click `Next`.

3. **Template**

  Now you will be able to see the large collection of Platform.sh's supported templates. There are several types of templates available, including language-specific examples, ready-to-use frameworks you can build upon, and set applications you can start using immediately after installation.

  If you are more comfortable with a particular language, click the dropdown labeled `All languages`. Select a language and the template list will update.

  Select a template and click `Next`.

  {{< note >}}
  You can find the source code for all Platform.sh templates in the [GitHub Templates Organization](https://github.com/platformsh-templates).
  {{< /note >}}

4. **Plan & Pricing**

  Under your free trial, your project will be created under a "Development" plan size. The Console will tell you how many users, development environments, and the price of that plan after your trial has completed. After you have read through the features, click `Continue`.

With these few selections Platform.sh will create the project and build the template in less than two minutes.

{{< guide-buttons next="I've created a new project with a template" >}}
