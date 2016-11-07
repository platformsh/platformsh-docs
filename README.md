#Platform.sh User Documentation

This repository holds the public user documentation for [Platform.sh](https://platform.sh/).

Our documentation site ([Docs.Platform.sh](https://docs.platform.sh/)) is itself hosted on Platform.sh, and built using our powerful build-and-deploy system.

Every Pull Request is automatically built on Platform.sh, and a link provided to a fully built environment just for that PR.  Have a look at any open Pull Request at the "All checks have passed" section, then click "Details" next to the Platform.sh entry.  That will take you to a fully running site based on the result of what merging the PR would produce.  That's the same functionality we offer to every single customer project!  

## Tools

Our documentation site is built using [GitBook](https://www.gitbook.com/), a Node.js static site generator especially geared for documentation.  We rerun the build script on every deploy to produce a fresh static site instance.  

## Contributing

Our documentation is public because we want the public's help in improving and maintaining it!  See our [Contributing guidelines](CONTRIBUTING.md) for guidelines on filing Pull Requests.  All documentation is released under the [Creative Commons Attribution](LICENSE.md) license.

If you spot a problem, send us a Pull Request to fix it!  If you're not sure how, simply file an issue and we'll try to get to it ourselves. 
