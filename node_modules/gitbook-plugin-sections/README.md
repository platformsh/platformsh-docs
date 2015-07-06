GitBook plugin that allows you to display only selected sections of the page.
A typical use case is when you only want to cherry pick parts of an included multisection document.
Sections are referenced by their anchor.
Anchors are all lowercased variants of the section title with whitespace replaced by hyphen ('-'). For instance, "Compiling contracts with Solidity" will become `compiling-contracts-with-solidity`.

The list of sections to be included is specified in the header of the page as a comma separated list of quoted anchors as arguments of the `{% sections %}` directive tag.

```
{% sections "contracts", "compiling-contracts-with-solidity", "troubleshooting" %}
{% endsections %}

{% include "git+https://github.com/ethereum/go-ethereum.wiki.git/Contracts-and-transactions.md" %}
```
