---
title: Initialize a project
description: |
  Generate starter configuration for your Upsun project using AI or guided setup.
keywords:
  - init
  - configuration
  - setup
  - AI
---

The `init` command generates starter configuration files for your Upsun project. You can use AI to automatically analyze your codebase and generate appropriate configuration, or follow a step-by-step guided setup.

## Usage

```bash
upsun init
```

## Options

| Option             | Description                                                                                                                                          |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--ai`             | Use AI configuration (use `--ai=false` to disable)                                                                                                   |
| `--digest`         | Only show the repository digest (AI input) without sending it                                                                                        |
| `--yes` (`-y`)     | Answer "yes" to confirmation questions and accept defaults (including overwriting existing configuration, if it exists). Implies `--no-interaction`. |
| `--no-interaction` | Don't ask interactive questions; accept default values                                                                                               |

## AI configuration

When you run `upsun init` it will give you a choice between two options. You can use AI to analyze your project and generate configuration automatically, or you can opt to follow a guided setup.

The AI option will analyze the repository locally and send a sanitized "digest" to our API, which then contacts our AI provider.

You can view the repository digest using `upsun init --digest`. It contains:

* `tree`: a concise list of the files in the repository
* `reports`: a list of findings for each directory in the repository, including identified frameworks or build tools
* `selected_files`: the contents of a few files that look particularly relevant for configuration, including `README.md` and `Dockerfile`

Currently, OpenAI is the provider used for all configuration generation. This may change in the future.

## Privacy

Neither Upsun nor any of our AI providers will use your data for AI model training.

The selected files whose contents are included in the repository digest are chosen to be unlikely to include sensitive information.

The file contents are redacted locally before being sent to our API. Currently, we will redact email addresses and common or obvious secrets, identified using [`gitleaks`](https://github.com/gitleaks/gitleaks).

## Output

For both the AI and non-AI configuration processes, the result should be valid YAML, and in many cases it should be an acceptable starter configuration for the project.

Note that AI can make convincing-looking mistakes, and projects can be very diverse in layout.

Please review and edit your configuration to suit your needs.

Both the AI and non-AI processes will create an `.upsun/config.yaml` file in your project root with:

* Application configuration (see the [App reference](/create-apps/app-reference/_index.md))
* Service definitions (see [Add services](/add-services/_index.md)
* Route configurations (see [Define routes](/define-routes/_index.md))

After running the command, you can deploy your project:

```bash
git add .upsun/config.yaml
git commit -m 'Add Upsun configuration'
upsun project:set-remote
upsun push
```
