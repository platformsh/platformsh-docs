---
title: What YAML is
weight: -10
description: An introduction to what YAML is and how to create and modify YAML files.
---

[YAML](https://en.wikipedia.org/wiki/YAML) is a human-readable format for data serialization.
This means it can be used for structured data, like those in configuration files

## Basic YAML

A YAML file is a text file that ends in `.yaml`.  (Some systems use an alternative `.yml` extension, but Platform.sh uses the four-letter extension.)  It consists primarily of key value pairs, and supports nesting.  For example:

```yaml
name: 'app'
type: 'php:7.4'
build:
    flavor: 'composer'

disk: 1024
```

This example defines a key `name` with value `app`, a key `type` with value `php:7.4`, a key `disk` with a value of `1024`, and a key `build` that is itself a nested set of key/value pairs, of which there is only one: `flavor`, whose value is `composer`.  Informally, nested values are often referenced using a dotted syntax, such as `build.flavor`, and that format is used in this documentation in various places.

Keys are always strings, and may be quoted or not.  Values may be strings, numbers, Boolean, or further nested key/value pairs.  Alphanumeric strings may be quoted or not.  More complex strings (with punctuation, etc.) must be quoted.  Numbers should not be quoted.  The Boolean values `true` and `false` should never be quoted.

For quoted values, both single quotes (`'`) and double quotes (`"`) are valid.  Double quotes, however, will interpolate common escape characters such as `\n` and so forth.  For that reason using single quotes is generally recommended unless you want escape characters to be processed rather than taken literally.

In general the order of keys in a YAML file does not matter.  Neither do blank lines.  Indentation may be with any number of spaces, as long as it is consistent throughout the file.  Platform.sh examples by convention use four-space indentation.

## Multi-line strings

In case of long, multi-line strings, the `|` character tells the YAML parser that the following, indented lines are all part of the same string.  That is, this:

```yaml
hooks:
    build: |
        set -e
        cp a.txt b.txt
```

creates a nested property `hooks.build`, which has the value `set -e\ncp a.txt b.txt`.  (That is, a string with a line break in it.)  That is useful primarily for hooks, which allow the user to enter small shell scripts within the YAML file.

## Anchors

YAML supports internal named references, known as "anchors."  They can be referenced using an "alias."  That allows you to have a large block of YAML that gets repeated multiple times in different places within a single file without having to copy-paste the whole block.

An anchor is defined by appending `&name` to a segment, where "name" is some unique identifier.  For example:

```yaml
relationships: &rels
    database: 'mysqldb:db1'
    cache: 'rediscache:redis'
    search: 'searchserver:elasticsearch'
```

This block defines an anchor called `rels`, the contents of which is the 3 key/value pairs for `database`, `cache`, and `search`.

An anchor can be referenced using an alias like `*name`, which will inject the anchored value into the file at that point.  That is, the following two snippets are logically equivalent:

```yaml
foo: &foo
    thing: stuff
    many: {'stuff', 'here'}
bar: *foo
```

```yaml
foo:
    thing: stuff
    many: {'stuff', 'here'}
bar:
    thing: stuff
    many: {'stuff', 'here'}
```

By default, aliases will inject their child contents entirely.  If you want to overwrite a specific child key of an anchor there is a different alias syntax you must use:

```yaml
foo: &foo
    thing: stuff
    many: {'stuff', 'here'}
bar:
    <<: *foo
    thing: other
```

Which is equivalent to:

```yaml
foo:
    thing: stuff
    many: {'stuff', 'here'}
bar:
    thing: other
    many: {'stuff', 'here'}
```

Be aware that aliases sometimes have requirements around their whitespace formatting that may not be clear.
In particular, when aliasing a anchor into a YAML array the alias reference must be at the same indentation level as any overrides.

```yaml
- &mylist
    list: of
    values: here

-
    <<: *mylist    # These two lines must start at the same indentation.
    values: there
```

### Anchor example

Anchors and aliases are mainly useful when you want to repeat a given block of configuration.  For example, the following snippet will define three identical worker instances within a `.platform.app.yaml` file:

```yaml
workers:
    queue1: &runner
        size: 'S'
        commands:
            start: python queue-worker.py
        variables:
            env:
                type: 'worker'
    queue2: *runner
    queue3: *runner
```


s