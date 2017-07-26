# TYPO3 Frequently Asked Questions (FAQ)

## Why are there warnings in the install tool?

The TYPO3 install tool doesn't yet fully understand when you are working on a cloud envirionment and may warn you that some folders are not writable.

Don't worry, your TYPO3 installation will be fully function.

## How do I add extensions?

TYPO3 extension can easily be added using composer. Just use the platform.sh CLI tool to run composer, as follows:

```bash
platform get <project id> -e <branch name>
composer require typo3-ter/[extension name]
git add composer.*
git commit
git push 
```

