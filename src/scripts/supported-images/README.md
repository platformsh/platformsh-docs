# Edit once, update everywhere: Keeping image versions up-to-date

## Overview of the problem

The Platform.sh Engineering team continuously releases new images for service and runtime containers, and it is our goal to have those updates documented as quickly and completely as possible at all times. This problem comes with a few specific issues to be solved:

* Supported (and deprecated) versions of a language or service are documented in multiple places. It is our goal that references to these image versions should be up to date and identical at all times.
* Each usage example in the documentation should always reference the most recent release when appropriate.
* Updating each reference should be done in a single pull request every time a new image is released. 

## Documenting a new version release in `versions.json`

`versions.json` should act as a single edit point for new image version releases. If, for example, Engineering has told us that Platform.sh now supports MariaDB 10.3, it should be added as the last element of `object.mysql.supported`: 

```json
"mysql": {
  "name": "MariaDB\/MySQL",
  "type": "mysql",
  "supported": [
    "10.0",
    "10.1",
    "10.2",
    "10.3
  ],
  "deprecated": [
    "5.5"
  ],
  "docs": "/configuration/services/mysql.html"
},
```
    
This not only ensures that the newly supported version is visible on every page of the documentation that it is referenced, but also so that when we provide a usage example for that image the *most recent version* is always used.

If the only change is that a new version of an image is released, this is the extent of the update for most images. 

### Special Cases

#### Varnish

#### Elasticsearch

## Documenting a new image release in `versions.json`

A new runtime or service image will require an identical structure to the rest of the children in the `version.json` object. For example, Engineering has told us that they have just released the service "JediMindTrix" version 42, that can be called in a `service.yaml` by with `type: jedi-trix:42`. While we are creating the documentation page `/configuration/services/jedimindtrix.html`, we should include the following entry in `versions.json`:

```json
{
  "services": {
    ...,
    },
    "jedi-trix": {
      "name": "JediMindTrix",
      "type": "jedi-trix",
      "supported": [
        "42"
      ],
      "deprecated": [

      ],
      "docs": "/configuration/services/jedimindtrix.html"
    },
    ...
  },
  "runtimes" : {
  ...
  }
}
```

The construction of tables goes through `versions.json` in the order it is written, so make sure to place the new entry so that it remains ordered alphabetically. Also remember to keep the `"deprecated"` key in this new entry from the beginning - it will make editing later easier and will keep the `makeImagesTable` function working properly.

In the new page of the documentation for "JediMindTrix", under the "Supported versions" section, you will need to also include the following:

```html
## Supported versions

<div id = "jediSupported"></div>

<script>
makeImagesList("services", "jedi-trix", "supported", "jediSupported");
</script>
```

If the new service comes with pre-defined "deprecated" versions, copy the above into the "Deprecated versions" section with the `div id` "jediDeprecated" and change the third parameter of `makeImagesList` to "deprecated".

Once this sections are included on a service or language page of the documentation, any update made to `versions.json` for that image will always be up to date.

## Approach

In this directory `supported-image` there are two files:

* `versions.json`: Contains a JSON object with two keys - `runtimes` and `services`,  which each contain keys for every runtime and service we support. Here is an excerpt from that file:

    As you can see from the above sections, ach service and runtime is named with a key that is identical to it's `type`. It has a number of keys that are used in the display of version information throughout the documentation:
    
    * `"name"`: The name of the image as it might appear in plain text within lists and tables (i.e., PostgreSQL).
    * `"type"`: The image's `type` as used in `.platform.app.yaml` and `services.yaml`.
    * `"supported"`: Currently supported images, with the most recent additions appended to the end of the list.
    * `"deprecated"`: Deprecated images, with the most recent additions appended to the end of the list.
    * `"docs"`: The relative link of that image's primary documentation page.

* `versions.js`: A piece of javascript that contains a number of functions for reading from `versions.json` and in displaying its information in the documentation. The most important functions can be called directly in the documentation:

    * `makeImagesList`: Creates a list of "supported" or "deprecated" versions of an image. It is found in each "runtimes" and "services" page, and an example use for PHP looks like:
    
        ```html
        <div id = "phpSupported"></div>

        <script>
        makeImagesList("runtimes", "php", "supported", "phpSupported");
        </script>
        ```
        
        which will appear in the deployed documentation (as of June 2019) as:
        
        * 7.1
        * 7.2
        * 7.3
        
        The first parameter can be set to either "runtimes" or "services", and the second is the image `name` in `versions.json`. "supported" can be replaced with "deprecated", and "phpSupported" must be defined with a `<div id="phpSupported></div>` above it. 
        
    * `makeImagesTable`: Creates an HTML table of all runtimes or services, and contains each image `name` linked to its documentation, it's `type`, and its supported versions. An example use is found in the [Configure services](https://docs.platform.sh/gettingstarted/own-code/service-configuration.html) of the Getting Started guides, where it is called within the Markdown file:
    
        ```html
        <div>
          <table id="servicesTable" border="1">
          <tbody></tbody>
          </table>
        </div>
        
        <script>
        makeImagesTable("services", "supported", "servicesTable");
        </script>
        ```
        
     If either a new version of an existing image or an entirely new image is added to `versions.json`, this usage does not need to change.

## Future goals

If creating a single edit point for image releases proves useful, the approach could be expanded towards greater automation and relegated to other parts of the documentation that face a similar problem:

* Attempts to create literal strings in Node.js to keep `services.yaml` examples up to date with most recent versions have not worked. Fix that.
* Automate the creation of pull requests altogether for new images altogether when they are released and fully tested. DevRel will then be responsible for reviewing that PR and merging it.
* Updates to the documentation for templates should similarly applied that follow these principles. For example, each time a new template is added to template-builder that has a release tag on its associated repository, it should be added to the documentation in each section templates for that language are referenced, in a single pull request.




