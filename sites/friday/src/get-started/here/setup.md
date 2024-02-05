---
title: Setup
weight: 5
---

{{< note theme="info" title="Got code?" >}}
First things first, if you don’t have a local project, you need one. So please create your project locally by following the official guide of your choice.

<!-- Examples:
- [Express installation guide](https://expressjs.com/en/starter/installing.html)
- [Next.js installation guide](https://nextjs.org/docs/getting-started/installation)
- [Strapi installation guide](https://docs.strapi.io/dev-docs/installation) -->

Starter codebases:

<details>
  <summary>JavaScript/Node.js</summary>

- [Express installation guide](https://expressjs.com/en/starter/installing.html)
- [Next.js installation guide](https://nextjs.org/docs/getting-started/installation)
- [Strapi installation guide](https://docs.strapi.io/dev-docs/installation)

</details>

<details>
  <summary>PHP</summary>
  Something small enough to escape casual notice.

- [Laravel installation guide](https://laravel.com/docs/10.x#creating-a-laravel-project)
- [Symfony Getting start guide](/get-started/stacks/symfony/_index.md)

</details>

<details>
  <summary>Python</summary>
  Something small enough to escape casual notice.

- [Flask installation guide](https://flask.palletsprojects.com/en/2.3.x/installation)
- [Django installation guide](https://flask.palletsprojects.com/en/2.3.x/installation)
</details>

{{< /note >}}

{{% guides/requirements name="Express" %}}

## Initialize your Git repository

We need to initialize the local Git repository and commit local files, using the following command:

```bash {location="Terminal"}
git init
git add .
git commit -m "Initial commit."
```

{{< note theme="info" title="Don't commit dependencies" >}}

Whether you're migrating your own project, or are testing Upsun with a starter project, it's important that you never actually commit dependencies of your applications.
If you haven't already done so, be sure to ignore directories containing dependencies by updating your `.gitignore` file.

```bash
# JavaScript/Node.js
echo "node_modules" >> .gitignore

# PHP
echo "vendor" >> .gitignore

# Python
echo "env" >> .gitignore

git add .gitignore && git commit -m "Update .gitignore to ignore deps."
```

{{< /note >}}

{{< guide-buttons previous="Back" type="*" >}}
