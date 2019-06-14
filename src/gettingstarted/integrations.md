# External Integrations

While you can host your application repository entirely on Platform.sh, it's likely that you will want to integrate your deployments with your pre-existing service. Platform.sh can be easily integrated with external services such as GitHub, Gitlab, or Bitbucket.

Choose your current service, and this guide will take you through the steps to mirror your repository on Platform.sh and have environments created automatically for your pull requests and branches.

<div class="column">
  <div id="github"></div>
</div>
<div class="column">
  <div id="gitlab"></div>
</div>
<div class="column">
  <div id="bitbucket"></div>
</div>

<script>
    var descPathGH = getPathObj("/administration/integrations/github.html", "GitHub");
    var descButtonGH = {type: "basicFull", path: descPathGH, div: "github"};
    makeButton(descButtonGH);

    var descPathGL = getPathObj("/administration/integrations/gitlab.html", "GitLab");
    var descButtonGL = {type: "basicFull", path: descPathGL, div: "gitlab"};
    makeButton(descButtonGL);

    var descPathBB = getPathObj("/administration/integrations/bitbucket.html", "Bitbucket");
    var descButtonBB = {type: "basicFull", path: descPathBB, div: "bitbucket"};
    makeButton(descButtonBB);
</script>

These steps assume that you have already:

* Signed up for a [free trial account](https://accounts.platform.sh/platform/trial/general/setup) with Platform.sh.

If you have not completed these steps by now, click the links and do so before you begin.
