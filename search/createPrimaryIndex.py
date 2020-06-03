import os
import json
import yaml
import hashlib
import requests
from platformshconfig import Config

config = Config()
final_templates_location = "output/templates.json"
final_docs_location = "output/docs.json"

def getIndexes():
    """
    Generates Meilisearch indexes for Docs and Templates from their data in the docs app.
    """

    # Platform.sh: Get data via "docs" relationship.
    if config.is_valid_platform():
        docs_data = loadDataPSH("/index.json")
        template_data = loadDataPSH("/templates.yaml")
    # Local: Get data from local project.
    else:
        template_data = loadDataLocal("../docs/data/", "templates.yaml")
        docs_data = loadDataLocal("../docs/public/", "index.json")

    # Update Template Data to Meilisearch format
    template_data = updateTemplateData(template_data)

    # Write the index files
    writeFile(final_templates_location, template_data)
    writeFile(final_docs_location, docs_data)


def updateTemplateData(data):
    """Updates template data according to Meilisearch documents format.

    Args:
        data (dict): Loaded Template data.

    Returns:
        indexData (array): Meilisearch data format.
    """
    indexData = []

    for language in data:
        for template in data[language]:
            temp = {}
            temp["site"] = "templates"
            temp["section"] = "<b>Templates | </b><code>{}</code>".format(language)
            temp["rank"] = 2
            temp["title"] = template['name']
            temp["text"] = template['description']
            temp["url"] = template['repo']
            temp["documentId"] = hashlib.sha1(template['repo'].encode('utf-8')).hexdigest()
            temp["subsections"] = "template"

            indexData.append(temp)

    return indexData

def loadDataLocal(path, file):
    """Loads data from the local 'docs' project directory following a Hugo build.

    """
    try:
        with open(path + file, 'r') as data:
            if file.split(".")[1] == "json":
                return json.load(data)
            elif file.split(".")[1] == "yaml":
                return yaml.safe_load(data)
    except:
        print("{} not found. Run 'hugo' from the 'docs' subdirectory to get that file first.".format(path + file))

def loadDataPSH(path):
    """Loads data from docs relationship.

    Args:
        path (string): the file endpoint.

    Returns:
        dict: Loaded data from the file endpoint.
    """
    docsLocation = config.credentials('docs')['host']
    r = requests.get("{}/{}".format(docsLocation, path))
    if path.split(".")[1] == "json":
        return json.loads(r.text)
    elif path.split(".")[1] == "yaml":
        return yaml.safe_load(r.text)

def writeFile(path, data):
    """Writes index data to a local file.

    Args:
        path (string): final save location.
        data (dict): Meilisearch index data.
    """
    with open(path, 'w') as f:
        json.dump(data, f)


# Run the thing.
getIndexes()
