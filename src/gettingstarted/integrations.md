# External Integrations

While you can host your application repository entirely on Platform.sh, it's likely that you will want to integrate your deployments with you pre-existing service. Platform.sh can be easily integrated with external services such as GitHub, Gitlab, or Bitbucket. 

Choose your current service, and this guide will take you through the steps to mirror your repository on Platform.sh and have environments created automatically for your pull requests and branches.

<div id = "integrations"></div>

<script>
var githubPath = getPathObj("/administration/integrations/github.html", "GitHub");
var github = {type: "basic", path: githubPath};

var bitbucketPath = getPathObj("/administration/integrations/bitbucket.html", "Bitbucket");
var bitbucket = {type: "basic", path: bitbucketPath};

var gitlabPath = getPathObj("/administration/integrations/gitlab.html", "GitLab");
var gitlab = {type: "basic", path: gitlabPath};

var integrations = {type: "multi", children: [github, bitbucket, gitlab], div: "integrations"};

makeMultiButton(integrations);
</script>

These steps assume that you have already:

* Signed up for a [free trial account](https://accounts.platform.sh/platform/trial/general/setup) with Platform.sh.
* [Pushed your own code](/gettingstarted/own-code.md) to Platform.sh.

If you have not completed these steps by now, click the links and do so before you begin.
