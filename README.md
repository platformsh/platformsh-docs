# Platform.sh User Documentation

This repository holds the public user documentation for [Platform.sh](https://platform.sh/).

Our documentation site ([docs.platform.sh](https://docs.platform.sh/)) is itself hosted on Platform.sh, and built using our powerful build-and-deploy system.

Every pull request is automatically built on Platform.sh, and a link provided to a fully built environment just for that PR. Have a look in any open pull request at the Checks section, on the Platform.sh row, then click on the "Details" link on the right side of the row. That will take you to a fully functional site based on the changes in the PR. We offer the same functionality to all of our customers!

## Tools

Our documentation site is built using [GitBook](https://github.com/GitbookIO/gitbook/), a Node.js static site generator especially focused on documentation. We rerun the build script on every deploy to produce a fresh static site instance.

## Contributing

Our documentation is public because we want your help in improving and maintaining it. See our [Contributing guidelines](CONTRIBUTING.md) for guidelines on filing pull requests. All documentation is released under the [Creative Commons Attribution](LICENSE.md) license.

If you spot a problem, send us a pull request to fix it! If you're not sure how, you can also file an issue and we'll try to get to it ourselves.
