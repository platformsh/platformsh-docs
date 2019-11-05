# Deploy on Platform.sh

Platform.sh offers a number of project templates as part of the project setup wizard to make bootstrapping a new project easy.  However, you can also create arbitrary links to spawn projects on Platform.sh from an arbitrary Git repository or prepared template.

There are two ways to create such a link, shown below.  In each case, when a user clicks on the link they will be redirected to create a new Platform.sh project, with the template selection step skipped in favor of the template specified.  If the user does not have a Platform.sh account yet they will be prompted to create one.

You may include the link on your own project's website, your company's internal Wiki, or anywhere else a link can go to make launching your code base as simple as possible.

## Arbitrary Git repository

Create a link in the following form:

```
https://console.platform.sh/projects/create-project?template=GIT_URL
```

Where GIT_URL is the URL of a publicly-visible Git repository.  For example, to install Platform.sh's [Drupal 8 template on GitHub](https://github.com/platformsh-templates/drupal8) you would use:

```
https://console.platform.sh/projects/create-project/?template=https://github.com/platformsh-templates/drupal8.git
```

(Note that is the URL of the Git repository as if you were cloning it, NOT the URL of the repository's home page on GitHub.)

A new project will be created, initialized with whatever code is at the tip of the `master` branch of that repository.  This method will work for any publicly-visible Git repository, provided that it includes the necessary Platform.sh YAML configuration files.  If those are missing the project will still initialize but fail to build.

## Defined Template

Create a link in the following form:

```
https://console.platform.sh/projects/create-project?template=TEMPLATE_URL
```

Where TEMPLATE_URL is the URL of a publicly-visible template definition file.  A template definition file is a YAML file that references a Git repository but can also include additional information, such as limiting the resulting project to a certain minimum project size or only allowing it to be deployed in certain regions.  Use this mechanism when you want more control over how the template gets deployed.

For example, to install Platform.sh's [Drupal 8 template](https://github.com/platformsh-templates/drupal8) you would use:

```
https://console.platform.sh/projects/create-project/?template=https://github.com/platformsh/template-builder/blob/master/templates/drupal8/.platform.template.yaml
```

A new project will be created, initialized with whatever code is at the tip of the `master` branch of the repository referenced by that file, provided that it includes the necessary Platform.sh YAML configuration files.  If those are missing the project will still initialize but fail to build.

A list of all [Platform.sh-supported templates](https://github.com/platformsh/template-builder/tree/master/templates) is available on GitHub.  [3rd party templates](https://github.com/platformsh/templates-external/) are also available.  You can also create your own template file and host it anywhere you wish.

The template definition file's format is [documented](https://github.com/platformsh/templates-external/blob/master/template-definition.yaml) in the 3rd party template repository.

## Listing a repository

Platform.sh welcomes project templates produced by the application vendor.  If you have a Free Software application you want available in the Platform.sh setup wizard, create a template definition file and submit a pull request against the [3rd party templates](https://github.com/platformsh/templates-external/) repository.  The Developer Relations team will review and evaluate the application and template, and may offer feedback before merging.  Generally speaking, we welcome any Free Software application that is actively maintained and runs well on Platform.sh.  Projects released under a non-Free license will not be accepted.
