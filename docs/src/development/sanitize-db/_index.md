---
title: Sanitize databases
description: Remove sensitive information from databases on non-production environments to control access.
layout: list
toc: false
---

When working on a new feature on your website, you want to use a new branch.
Using a new branch makes sure that you don't risk breaking your live, production website.

Creating a branch on Platform.sh copies both the code and the database to that new development branch.
These code and database changes need to be tested before being merged into production.
Depending on your processes, internal, or external teams may interact with the development environment branch.

Databases of live websites often contain personally identifiable information (PII)
such as full names, mailing addresses, and phone numbers.
To ensure people reviewing the code changes can't access information they shouldn't, sanitize the database of any PII that it may contain.

## Examples 

