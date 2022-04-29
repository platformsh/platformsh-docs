---
title: A title (using a noun like this one)
sidebarTitle: Optional short title if 'title' is long
description: A short description (up to ~160 characters) of the article that should make sense out of context (like on a listing page).
---

<!-- 
When to use
  To document details about a subject without describing its purpose.
  For people who already understand the general concept and just need to refer to some details.
  Only for information, not for usage instructions or explanations.
  https://diataxis.fr/reference/

How to use
  1. Copy this template into the right directory in /src/docs/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
-->

A brief introduction of what this file is useful for.
It would be best to link to an example of how to use it elsewhere in the docs.

<!-- 
Tone
  A reference should be written in a clear and informational way.
  Keep any explanations short and unambiguous.
Sections
  Tables are the preferred way to present structured data like parameters.
  Keep all tables as single-level (without merged cells) and break out additional properties,
  as in the example below.
-->

## Parameters

| Name   | Type      | Required | Description |
| ------ | --------- | -------- | ----------- |
| `type` | `string`  | Yes      | A [route type](#route-types). |
| `ssi`  | `boolean` | No       | Controls whether [server side includes](/define-routes/ssi.md) are enabled. |

### Route types

| Name       | Type     | Required | Description |
| ---------- | -------- | -------- | ----------- |
| `upstream`  | `string` | No       | Serves an application. More explanation.      |
| `redirect` | `string` | No       | Redirects to another route. More explanation. |

