{{ $type := .Get "service" }}

An integration from {{ $type }} to {{ .Site.Params.vendor.name }} establishes that:

- {{ $type }} is the source of truth, where Git operations occur
- {{ .Site.Params.vendor.name }} is a mirror of that repository - provisioning infrastructure according to configuration, and orchestrating environments according to the branch structure of the {{ $type }} repository

Actions that take place on {{ .Site.Params.vendor.name }} don't affect commits on {{ $type }}.
Because of this, the {{ $type }} integration enables both `fetch-branches` (track branches on {{ $type }}) and `prune-branches` (delete branches that don't exist on {{ $type }}) by default.
You can change these settings but it is recommend to keep them.

When enabled by default, you are limited by design as to what actions can be performed within the context of a {{ .Site.Params.vendor.name }} project with a {{ $type }} integration:

| Action         | Observation         | Recommendation |
| :---------------- | :---------------- | :------- |
| Branch from parent | Running [`environment:branch`](/administration/cli/reference#environmentbranch) with the CLI, or selecting **Branch** in Console produces a new child environment, but it's deleted shortly after automatically. | Contribute to the {{ $type }} repository itself by creating a branch and pull request. When the PR has been opened, a new environment will be provisioned for it.  |
| Merge in parent | Running [`environment:merge`](/administration/cli/reference#environmentmerge) with the CLI fails locally, and the **Merge** option in Console is not clickable. | Review and merge pull requests and/or branches on the {{ $type }} repository. |
| Merge into child (sync code) | Running [`environment:synchronize`](/administration/cli/reference#environmentsynchronize) with the CLI fails locally, and the **Sync** option in Console won't allow me to include `code` in that sync. | Perform the merge locally from a matching branch on {{ $type }}. For example, clone the most recent parent (`git pull origin parent-branch`), switch to the pull request branch (`git checkout ga-staging`), and then merge the parent into the current branch (`git merge main`). |