---
title: "Access your site"
weight: 6
description: |
  Find the URLs you can use to access your site via a web browser.
---

Once you have an environment running, you can view it in a web browser. 
To find which URLs you can use to access your site, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

1. Select the project whose URLs you want to find.
2. From the **Environment** menu, select an environment.
3. Click **URLs**.

Copy and paste any of these URLs into a web browser and access your site.

<--->

---
title=Using the CLI
file=none
highlight=false
---

1. Run the following command:

   <div class="highlight">
     <pre class="chroma"><code class="language-bash" data-lang="bash">platform url --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}</code></pre>
   </div>

2. Select the URL to open in a browser.

{{< /codetabs >}}

For more information about URLs in your project and how you can control access to your web applications, 
see how to [define routes](../define-routes/).


