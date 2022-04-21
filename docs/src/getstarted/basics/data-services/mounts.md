---
title: "Mounts: data in files"
sidebarTitle: "Data in files"
weight: 1
description: |
  Learn the basics of data with mounts.
---

## Add data

In your local repository, checkout `main` (`git checkout main`) and then run the following command:

```bash
platform environment:deactivate updates -y
```

Viewing the project in the management console, you will only be able to see the **updates** environment if the _inactive_ **Filter** has been selected.
While the `updates` branch still exists on the remove, it is now an **inactive environment**.
There is no deployed site there anymore.

Create a new environment called data:

```bash
$ git pull platform main
$ platform environment:branch data
```

Then add the following to the bottom our your `.platform.app.yaml` file:

```yaml
disk: 512
mounts:
    'data':
        source: local
        source_path: data
```

At runtime, the filesystem your application runs from is read-only. 
You saw in the previous guide how this rule provides the ability to leverage Git so that Platform.sh can reuse build images.

Many applications, however, do require write access to parts of the filesystem at runtime. 
If your users upload files to your site, the directory where you would keep those files is one example. 

On Platform.sh, you must define these kinds of directories explicitly by configuring a **mount** for your application using the `mounts` attribute.
These directories do not contain committed files, only data. 
The change above defines a single mount accessible within the filesystem at `~/data`, and it has been given 512 mB of disk to work with.

Locally, run the following commands:

```bash
mkdir data && echo "First data file." > data/data.txt && echo data >> .gitignore
```

`data` is now an uncommitted subdirectory in your repository, containing one data file `data.txt`. 

Commit and push this change:

```bash
git commit -am "Add some data." && git push platform data
```

Next, upload the new file to the mount you just created on the environment.

```bash
platform mount:upload --mount=data --source=data
```

Verify that the data has been uploaded to the `data` environment by running the following:

```bash
$ platform ssh -e data -q 'cat data/data.txt'
First data file.
```

## Branches

From the local branch `data`, run the command:

```bash
platform environment:branch data-child
```

You will now have a project structure that looks like this in the management console.

![First branch](/images/getstarted/mount-branches.png)

Now run the command:

```bash
platform ssh -e data-child -q 'cat data/data.txt'
```

You will see the contents of the previous environment: `First data file.`.
Like before, this child environment (`data-child`) has inherited infrastructure from its parent (`data`), but now it also includes it's data when it was created. 


## Merges

Now for the opposite direction.
In your terminal, still checked out from `data`, run this command:

```bash
platform environment:merge -y
```

When the activity has completed, check the mount now available on the production branch:

```bash
platform ssh -e main -q 'cat data/data.txt'
```

While the mount is now present on the production environment, the file is not. 
Data is inherited by child environment from their parents, but does not make it upwards via merges. 
The only way to move up to production is via commits.

## Syncing data

SSH into the production environment:

```bash
platform ssh -e main
```

Within that session, create a new data file in the mount:

```bash
echo "PRODUCTION data file." > data/data.txt
```

Then close the sesssion using `ctrl + d`. 
While still on the `data` branch locally, run the following command:

```bash
platform environment:sync data
```

Let the activity complete, then run:

```bash
$ platform ssh -e data -q 'cat data/data.txt'
PRODUCTION data file.
```

With the above command, you've resynced production data to the child environment, `data`. 

## Recap

While data is handled slightly differently than code, on Platform.sh environments also inherit data from their parent environments by leveraging Git.

- It is possible to define `mounts`, which retain write access at runtime to contain and revise data in files.
- Branching from a parent environment (production, or otherwise) automatically inherits all of the data within mounts to child environments.
- Data flows down, not up, so production data is secure from modification during merges.
- At any time you can resync the data within a child development environment to match production with `platform environment:sync`.

Inheriting production data is how Platform.sh provides true staging environments for your work. 
Production data, inherited infrastructure, and resuable builds keep the whole process consistent and predictable so that you can know for certain that behavior in staging will match behavior in production when you merge.

Data in files is not the only data you'll be interested in, however. 
Platform.sh handles production data within **services** in exactly the same way. 
Just like `mounts`, Platform.sh provides committable configuration for services in a wholly managed way.

So before you see how data is inherited in databases and other services, in the next section you will see how to create services using Platform.sh's **managed services** configuration.

{{< guide-buttons next="Create a service" >}}
