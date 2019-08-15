var fs = require('fs');

function NotValidImageError(message) {
    this.name = "NotValidImageError";
    this.message = (message || "");
}
NotValidImageError.prototype = ReferenceError.prototype;


/**
 * ConfigGenerator class for writing example configuration YAML files for
 * images in the Platform.sh Registry. Using
 *
 *     cg.write();
 *
 * Writes three configuration files for every runtime (.platform.app.yaml) and
 * six files for each service (.platform.app.yaml & .platform/services.yaml) in
 * three formats - heavily commented full files, un-commented full files, single
 * line snippets.
 *
 * Alternatively you can pass a single image to write()
 *
 *    cg.write("elasticsearch");
 *
 * and only the six files for Elasticsearch will be generated/updated.
 *
 */
class ConfigGenerator {
  constructor(jsonSource, saveDir) {
    this.saveDir = saveDir;
    this.jsonSource = jsonSource;
  }

  /**
   * Getter for the parsed JSON object that has been read from the Registry.
   *
   * @return {object}
   *   Registry data object.
   */
  get registry () {
    return this.initializeRegistry();
  }

  /**
   * Method to create the parsed JSON object read from the Registry.
   *
   * @return {object}
   *   Registry data object.
   */
  initializeRegistry () {
    var contents = fs.readFileSync(this.jsonSource);
    try {
      return JSON.parse(contents);
    } catch (exc) {
        throw new InvalidJSONError(exc);
    }
  }

  /**
   * Getter for the locations where example config files will be generated to.
   *
   * @return {object}
   *   Locations data object.
   */
  get saveLocations () {
    return this.defineSaveLocations();
  }

  /**
   * Creates the locations data object for the three file destinations.
   *
   * @return {object}
   *   Location data object.
   */
  defineSaveLocations () {
    // If no saveDir is defined, use the directory where the registry.json is located.
    if (this.saveDir == null) {
      var split = this.jsonSource.split('/');
      split.splice(-1,1);
      split.push('examples');
      this.saveDir = split.join('/') + '/';
    }

    // Check if each save directory exists, and create them if they don't.
    if (!fs.existsSync(this.saveDir)){
        fs.mkdirSync(this.saveDir);
    };
    if (!fs.existsSync(this.saveDir + 'commented/')){
        fs.mkdirSync(this.saveDir + 'commented/');
    };
    if (!fs.existsSync(this.saveDir + 'full/')){
        fs.mkdirSync(this.saveDir + 'full/');
    };
    if (!fs.existsSync(this.saveDir + 'snippet/')){
        fs.mkdirSync(this.saveDir + 'snippet/');
    };

    return {
      "commented": this.saveDir + 'commented/',
      "full": this.saveDir + 'full/',
      "snippet": this.saveDir + 'snippet/'
    };
  }

  /**
   * Generates all of the example .platform.app.yaml files for a given runtime image.
   *
   * @param {string} image
   *   The image key in the Registry object.
   */
  generateRuntimeYAMLs (image) {
    // Generate the config snippet (/snippet/<runtime>.app.yaml).
    //    Define the content.
    let rawSnippet = `type: ${this.registry[image].type}:${this.registry[image].versions.recommended}`;
    //    Write the file.
    this.writeAppYAML(this.saveLocations.snippet, image, rawSnippet);

    // Generate the full file without comments (/full/<runtime>.app.yaml).
    this.writeAppYAML(this.saveLocations.full, image, rawSnippet);

    // Generate the full file with heavy comments (/commented/<runtime>.app.yaml).
    //    Define the content.
    let commentedSnippet = `# The runtime the application uses. The 'type' key defines the base container
# image that will be used to run the application. There is a separate base
# container image for each primary language for the application, in
# multiple versions. Check the ${this.registry[image].name} documentation
# (https://docs.platform.sh${this.registry[image].docs.url}#supported-versions)
# to find the supported versions for the '${this.registry[image].type}' type.
${rawSnippet}`;
    //   Write the file.
    this.writeAppYAML(this.saveLocations.commented, image, commentedSnippet);
  }

  /**
   * Generates all of the example configuration files for a given image.
   *
   * @param {string} image
   *   The image key in the Registry object.
   */
  generateServiceYAMLs (image) {

    // Generate the .platform.app.yaml files for the service image.
    this.generateServiceAppYAMLS(image);

    // Generate the .platform/services.yaml files for the service image.
    this.generateServiceServiceYAMLs(image);
  }

  /**
   * Generates all of the example .platform.app.yaml files for a given relationship.
   *
   * @param {string} image
   *   The image key in the Registry object.
   */
  generateServiceAppYAMLS (image) {
    // Generate the config snippet (/snippet/<service>.app.yaml).
    //    Define the content.
    let snippetContentAPP = `  ${this.registry[image].docs.relationship_name}: "${this.registry[image].docs.service_name}:${this.registry[image].endpoint}"`;
    //    Write the file.
    this.writeAppYAML(this.saveLocations.snippet, image, snippetContentAPP);

    // Generate the full file without comments (/full/<service>.app.yaml).
    //    Define the content.
    let fullConfigAPP = `relationships:
${snippetContentAPP}`;
    //    Write the file.
    this.writeAppYAML(this.saveLocations.full, image, fullConfigAPP);

    // Generate the full file with heavy comments (/commented/<service>.app.yaml).
    //    Define the content.
    let fullCommentedAPP = `# The relationships block defines how services are mapped within your application.
# To access a service container, you must define a relationship to it.
relationships:
  # The relationship is specified in the form 'service_name:endpoint_name'.
  # The 'service_name' is the name of the service given in '.platform.services.yaml'.
  # The 'endpoint_name' is the exposed functionality of the service to use. In most
  # cases this is simply the same as the service 'type', but there are a few exceptions.
${snippetContentAPP}`;
    //    Write the file.
    this.writeAppYAML(this.saveLocations.commented, image, fullCommentedAPP);
  }

  /**
   * Generates all of the example .platform/services.yaml files for a given service.
   *
   * @param {string} image
   *   The image key in the Registry object.
   */
  generateServiceServiceYAMLs (image) {
    // Generate the config snippet (/snippet/<service>.services.yaml).
    //    Define the content.
    let fullConfig = `${this.registry[image].docs.service_name}:
  type: ${this.registry[image].type}:${this.registry[image].versions.recommended}`;

    //    Append the disk key if the service requires it.
    if ( this.registry[image].disk !== null ) {
      // Use a default disk size if no min_disk_size is defined.
      var disk_size = 256;
      if ( this.registry[image].min_disk_size ) {
        disk_size = this.registry[image].min_disk_size;
      }
      fullConfig += `
  disk: ${disk_size}`;
    };

    //    Write the file.
    this.writeServicesYAML(this.saveLocations.snippet, image, fullConfig);

    // Generate the full file without comments (/full/<service>.services.yaml).
    //    Write the file - snippet and full are identical.
    this.writeServicesYAML(this.saveLocations.full, image, fullConfig);

    // Generate the full file with heavy comments (/commented/<service>.services.yaml).
    //    Define the content.
    let fullCommentedSERV = `# The name given to the ${this.registry[image].name} service (lowercase alphanumeric only).
${this.registry[image].docs.service_name}:
  # The type of your service (${this.registry[image].type}), which uses the format
  # 'type:version'. Be sure to consult the ${this.registry[image].name} documentation
  # (https://docs.platform.sh${this.registry[image].docs.url}#supported-versions)
  # when choosing a version. If you specify a version number which is not available,
  # the CLI will return an error.
  type: ${this.registry[image].type}:${this.registry[image].versions.recommended}`;

    if ( this.registry[image].disk ) {
      fullCommentedSERV += `
  # The disk attribute is the size of the persistent disk (in MB) allocated to the service.
  disk: ${disk_size}`;
    };

    //    Write the file.
    this.writeServicesYAML(this.saveLocations.commented, image, fullCommentedSERV)
  }

  /**
   * Primary method for generating all configuration files.
   *
   * @param {string} image
   *   The service image key of the Registry object. If the image is undefined,
   *   the function will generate files for every image in the Registry.
   */
  write(image) {

    var exceptions = ['redis', 'mariadb', 'varnish'];
    // redis needs to create a duplicate (with mods) for redis-persistent
    // mariadb needs to create a duplicate (with mods) for mysql
    // varnish needs to be written wholesale differently than the logic of everything else

    // If no image is defined, generate files for every image in the Registry.
    if (image == undefined) {
        for(var image in this.registry){
          this.write(image)
        }
        // Update the content.json files in each subdirectory.
        this.generateContentFiles();
    } else {
      if (!this.registry.hasOwnProperty(image)) {
        throw new NotValidImageError(`Files cannot be generated for "${image}", because it's not a valid image in the Platform.sh registry.`);
      }
      // console.log(this.registry)
      if ( this.registry[image].runtime ) {
        // Generate the files for the runtime image.
        this.generateRuntimeYAMLs(image);
      } else {
        // Generate the files for the service image.
        this.generateServiceYAMLs(image);
      }
    }
  }

  generateContentFiles () {
    // Generate content.json for the commented files.
    this.makeSingleContentFile("commented");

    // Generate content.json for the full files.
    this.makeSingleContentFile("full");

    // Generate content.json for the snippet files.
    this.makeSingleContentFile("snippet");

  }

  supported (image) {
    return this.docsVersions(image, "supported");
  }

  deprecated (image) {
    return this.docsVersions(image, "deprecated");
  }

  docsVersions (image, lifecycle) {
    var current_supported = this.registry[image].versions[lifecycle];
    // Make the raw string.
    var raw_string = this.registry[image].versions[lifecycle].join(", ");
    // Make the unorderedList.
    var unorderedList = "<ul>";
    for(var version of this.registry[image].versions[lifecycle]) {
      unorderedList += `<li>${version}</li>`;
    }
    unorderedList += "</ul>";

    return {
      "rawstring": raw_string,
      "bullets": unorderedList
    }

  }

  makeSingleContentFile (subdir) {
    fs.readdir(this.saveLocations[subdir], (err, files) => {
      var contentFiles = {"files": []};
      files.forEach(file => {
        contentFiles.files.push(file);
      });
      // Write the content.json, excluding content.json from the file list.
      var finalContent = {"files": []};
      finalContent.files = contentFiles.files.filter(e => e !== 'content.json');
      this.generateFile(this.saveLocations[subdir] + "content.json", JSON.stringify(finalContent, null, 2));
    });
  }

  /**
   * Writes the example .platform/services.yaml file for a given image.
   *
   * @param {string} location
   *   The location where the generated YAML file will be saved to.
   * @param {string} image
   *   The service or runtime name used as the key for the JSON object.
   * @param {string} content
   *   The content string that will be written to the generated file.
   */
  writeAppYAML(location, image, content) {
    var filename = `${location}${image}.app.yaml`;
    this.generateFile(filename, content);
  }

  /**
   * Writes the example .platform.app.yaml file for a given image.
   *
   * @param {string} location
   *   The location where the generated YAML file will be saved to.
   * @param {string} image
   *   The service or runtime name used as the key for the JSON object.
   * @param {string} content
   *   The content string that will be written to the generated file.
   */
  writeServicesYAML(location, image, content) {
    var filename = `${location}${image}.services.yaml`;
    this.generateFile(filename, content);
  }

  /**
   * Writes a file.
   *
   * @param {string} filename
   *   Filename with save location prefix included.
   * @param {string} content
   *   The content string that will be written to the generated file.
   */
  generateFile(filename, content) {
    fs.writeFile(filename, content, function (err) {
      if (err) throw err;
    });
  }
}

/**
 * Creates a new Registry instance that represents the current environment.
 *
 * @returns {ConfigGenerator}
 */
function configGenerator(jsonSource) {
    return new ConfigGenerator(jsonSource);
}

module.exports = {
    configGenerator,
};

// In testing, also expose the class so we can pass in test data.
if (process.env.NODE_ENV === 'test') {
    module.exports.ConfigGenerator = ConfigGenerator;
    module.exports.NotValidImageError = NotValidImageError;
}
