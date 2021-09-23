---
title: "Variables"
weight: 8
toc: false
---

Platform.sh provides a number of ways to set [variables](/development/variables.md), either globally or specific to a single environment. For non-secret values that should be consistent across all environments (because they're configuring the application itself), you can set them in the `.platform.app.yaml` file.

All variables in the `.platform.app.yaml` file must have a prefix. Some [prefixes have specific meanings](/development/variables.md#variable-prefixes), while others are only significant to a particular application. Nested variables are automatically converted into a nested array or list structure as appropriate to the language.

For example, the following section in `.platform.app.yaml` sets a single variable named `env:AUTHOR` with the value `Juan`.

```yaml
variables:
    env:
        AUTHOR: 'Juan'
```

This has the exact same effect as setting a project variable via the CLI as follows except it is versioned along with the code:

```bash
$ platform variable:create env:AUTHOR --level project --value Juan
```

The variable name may itself have punctuation in it. For example, to set a Drupal 8 configuration override (assuming you're using the recommended `settings.platformsh.php` file), you can do the following:

```yaml
variables:
    d8config:
        "system.site:name": 'My site rocks'
```

This creates a Platform.sh variable (an item in the `$PLATFORM_VARIABLES` environment variable) named `d8config:system.site:name` with the value `My site rocks`.

## Complex values

Variable values don't have to be only strings. They can also have nested structures. Structured variables with an `env:` prefix are mapped to environment variables with JSON strings for values. Other variables are included in the `PLATFORM_VARIABLES` environment variable.

For example, the following variable definitions:

```yaml
variables:
    env:
        BASIC: "a string"
        INGREDIENTS:
            - 'peanut butter'
            - 'jelly'
        QUANTITIES:
            "milk": "1 liter"
            "cookies": "1 kg"
    stuff:
        STEPS: ['un', 'deux', 'trois']
        COLORS:
            red: '#FF0000'
            green: '#00FF00'
            blue: '#0000FF'
```

Would appear as follows:

{{< codetabs >}}

---
title=Shell
file=none
highlight=bash
markdownify=false
---

$ echo $BASIC
a string
$ echo $INGREDIENTS
["peanut butter", "jelly"]
$ echo $QUANTITIES
{"cookies": "1 kg", "milk": "1 liter"}
$ echo "$PLATFORM_VARIABLES" | base64 --decode | jq '."stuff:STEPS"'
[
  "un",
  "deux",
  "trois"
]
$ echo "$PLATFORM_VARIABLES" | base64 --decode | jq '."stuff:COLORS"'
{
  "blue": "#0000FF",
  "green": "#00FF00",
  "red": "#FF0000"
}

<--->

---
title=PHP
file=none
highlight=php
markdownify=false
---
<?php
var_dump($_ENV['BASIC']);
// string(8) "a string"

var_dump($_ENV['INGREDIENTS']);
// string(26) "["peanut butter", "jelly"]"

var_dump($_ENV['QUANTITIES']);
// string(38) "{"milk": "1 liter", "cookies": "1 kg"}"

$variables = json_decode(base64_decode($_ENV['PLATFORM_VARIABLES']), TRUE);

print_r($variables['stuff:STEPS']);
/*
array(3) {
  [0]=>
  string(2) "un"
  [1]=>
  string(4) "deux"
  [2]=>
  string(5) "trois"
}
*/

print_r($variables['stuff:COLORS']);
/*
array(3) {
  ["red"]=>
  string(7) "#FF0000"
  ["green"]=>
  string(7) "#00FF00"
  ["blue"]=>
  string(7) "#0000FF"
}
*/

<--->

---
title=Python
file=none
highlight=python
markdownify=false
---
import os
import json
import base64

print os.getenv('BASIC')
# a string

print os.getenv('INGREDIENTS')
# ["peanut butter", "jelly"]

print os.getenv('QUANTITIES')
# {"milk": "1 liter", "cookies": "1 kg"}

variables = json.loads(base64.b64decode(os.getenv('PLATFORM_VARIABLES')).decode('utf-8'))

print variables['stuff:STEPS']
# [u'un', u'deux', u'trois']
print variables['stuff:COLORS']
# {u'blue': u'#0000FF', u'green': u'#00FF00', u'red': u'#FF0000'}

<--->

---
title=Node.js
file=none
highlight=javascript
markdownify=false
---
const { BASIC, INGREDIENTS, QUANTITIES, PLATFORM_VARIABLES } = process.env;

const { "stuff:STEPS": stuffSteps, "stuff:COLORS": stuffColors } = JSON.parse(
  Buffer.from(PLATFORM_VARIABLES, "base64").toString()
);

console.log(BASIC);
// "a string"
console.log(INGREDIENTS);
// ["peanut butter", "jelly"]
console.log(QUANTITIES);
// {"cookies": "1 kg", "milk": "1 liter"}
console.log(stuffSteps);
// [ 'un', 'deux', 'trois' ]
console.log(stuffColors);
// { blue: '#0000FF', green: '#00FF00', red: '#FF0000' }

{{< /codetabs >}}
