var rp = require('request-promise');
const yaml = require('js-yaml');
const fs   = require('fs');

var templateRepoRoot = "https://raw.githubusercontent.com/platformsh/template-builder/master/templates/";
var infoFile = ".platform.template.yaml";
var appYAML = "files/.platform.app.yaml";

const finalFileLocation = "data/templates.yaml";
const finalIndexLocation = "data/templatesindex.json"

var options = {
    uri: 'https://api.github.com/repos/platformsh/template-builder/contents/templates',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};

// .platform.app.yaml files that use the `!include` tag in their build hook have trouble parsing.
//    Multi-app templates that uses  a single runtime (i.e. gatsby-strapi) can be placed here as well.
const parseErrorTemplates = {
  "hugo": "golang",
  "strapi": "nodejs",
  "mattermost": "golang",
  "probot": "nodejs",
  "gatsby-strapi": "nodejs",
  "quarkus": "java"
}

// Multi-app overrides that use two different runtimes.
const multiAppTemplates = {
  "gatsby-wordpress": ["nodejs", "php"],
  "gatsby-drupal": ["nodejs", "php"],
  "elastic-apm": ["nodejs", "golang"],
}

async function getTemplateInfo(template, templateData){

  var optionsInfo = {
      uri: templateRepoRoot + template.name + "/" + infoFile,
      headers: {
          'User-Agent': 'Request-Promise'
      }
  };

  var results = await rp(optionsInfo)

      .then(function (data) {
          var info = {
            "name": "",
            "description": "",
            "image": "",
            "content": ""
          };
          // Get the runtime type.
          var infoDATA = yaml.safeLoad(data);

          info.name = infoDATA.info.name;
          info.description = infoDATA.info.description;
          info.image = infoDATA.info.image;
          info.content = infoDATA.info.notes[0].content;

          return info;
      })
      .catch(function (err) {
          // API call failed...
      });

  templateData.data.name = results.name;
  templateData.data.description = results.description;
  templateData.data.image = results.image;
  templateData.data.content = results.content;

  return templateData;

}

async function getTemplateRuntime(template){

  var templateData = {
    "runtime": "",
    "data": {
      "shortname": template.name,
      "name": "",
      "repo": "https://github.com/platformsh-templates/" + template.name,
      "description": "",
      "image": "",
      "deploy": `https://console.platform.sh/projects/create-project?template=https://raw.githubusercontent.com/platformsh/template-builder/master/templates/${template.name}/.platform.template.yaml`
    }
  };

  var optionsRuntime = {
      uri: templateRepoRoot + template.name + "/" + appYAML,
      headers: {
          'User-Agent': 'Request-Promise'
      }
  };

  if (!( template.name in parseErrorTemplates )) {

    templateData.runtime = await rp(optionsRuntime)

        .then(function (data) {
            // Get the runtime type.
            var runtimeDATA = yaml.safeLoad(data);
            var runtimeARR = runtimeDATA.type.split(":");
            return runtimeARR[0];
        })
        .catch(function (err) {
            // API call failed...
        });

  } else {

    templateData.runtime = parseErrorTemplates[template.name];

  }

  return templateData;

}

function addTemplateToData(runtime, data, templates) {
  if (!( runtime in data )) {
    data[runtime] = [ templates.data ];
  } else {
    data[runtime].push(templates.data);
  }
  return data
}

async function fetchTemplates() {

    rp(options)
      .then(function (templates) {
          var data = {}
          var count = 0;
          templates.forEach(async function(template, idx, array){
            if ( template.name != "__init__.py") {
              var templateData =  await getTemplateRuntime(template);
              var templatesWithInfo = await getTemplateInfo(template, templateData);

              // Check if template is a known multi-app.
              if ( template.name in multiAppTemplates) {
                for (runtime in multiAppTemplates[template.name]) {
                  data = addTemplateToData(multiAppTemplates[template.name][runtime], data, templatesWithInfo)
                }
              } else {
                data = addTemplateToData(templateData.runtime, data, templatesWithInfo)
              }

              count += 1;
              if (count === array.length - 1) {
                // Delete templates with undefined types
                delete data["undefined"]
                // Write the template data yaml
                fs.writeFileSync(finalFileLocation, yaml.safeDump(data, {noRefs:true}), function (err) {
                  if (err) throw err;
                });
              }
            }
          })
      })
      .catch(function (err) {
          console.log(err)
      })

}

console.log(`
### fetch-templates.js: Fetching Platform.sh template data.
`);

fetchTemplates()
