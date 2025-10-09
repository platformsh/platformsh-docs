---
title: Initialize a project
description: |
  Generate starter configuration files for your Upsun project by using AI or guided setup.
keywords:
  - init
  - configuration
  - setup
  - AI
---

The `init` command generates starter configuration files for your Upsun project.

## Usage

```bash
upsun init
```

When you run `upsun init`, you can choose how to generate your starter configuration files. You can either:
- Use AI to analyze your project and generate a configuration automatically. 
- Follow a guided setup, which does not use AI.

## AI configuration

The AI option analyzes the repository locally and sends a sanitized "digest" to the Upsun API, which then contacts our AI provider. 

You can view the repository digest by running `upsun init --digest`. The digest contains:

* `tree`: a concise list of the files in the repository
* `reports`: a list of findings for each directory in the repository, including identified frameworks or build tools
* `selected_files`: the contents of a few files that look particularly relevant for configuration, including `README.md` and `Dockerfile`

At this time, OpenAI is the provider used for all configuration generation.

## Privacy

{{% note theme="info"%}}
**Neither Upsun nor our AI providers will use your data for AI model training.**
{{% /note %}}

The selected files whose contents are included in the repository digest are chosen to be unlikely to include sensitive information.

The file contents are sanitized locally before being sent to the Upsun API. Upsun redacts email addresses and common secrets identified by using [`gitleaks`](https://github.com/gitleaks/gitleaks).


## Output

For both the AI and non-AI processes, the expected result is valid YAML. In many cases, the result is an acceptable starter configuration for the project.

{{% note theme="info"%}}
AI can make convincing-looking mistakes, and projects can be very diverse in layout.

Be sure to review and edit your configuration to suit your needs.
{{% /note %}}

Both the AI and non-AI processes create an `.upsun/config.yaml` file in your project root. This config file contains:  

* Application configuration (see the [App reference](/create-apps/app-reference/_index.md))
* Service definitions (see [Add services](/add-services/_index.md))
* Route configurations (see [Define routes](/define-routes/_index.md))

After running `upsun init`, you can deploy your project as follows:

```bash
git add .upsun/config.yaml
git commit -m 'Add Upsun configuration'
upsun project:set-remote
upsun push
```

## `init` command options {#init-options}

| Option             | Description                                                                                                                                          |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--ai`             | Use AI configuration (use `--ai=false` to disable)                                                                                                   |
| `--digest`         | Only show the repository digest (AI input) without sending it                                                                                        |
| `--yes` (`-y`)     | Answer "yes" to confirmation questions and accept defaults (including overwriting existing configuration, if it exists). Implies `--no-interaction`. |
| `--no-interaction` | Don't ask interactive questions; accept default values                                                                                               |
