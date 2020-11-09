import json
import yaml
import hashlib
from platformshconfig import Config

config = Config()

# Handle documentation/templates index source locations on Platform.sh and locally. 
if config.is_valid_platform():
    template_data = "data/templates.yaml"
    docs_data = "data/index.json"
else:
    template_data = "../docs/data/templates.yaml"
    docs_data = "../docs/public/index.json"

# Save the modified indexes to scrapy's output location so they can all be added together. 
final_templates_location = "output/templates.json"
final_docs_location = "output/docs.json"

with open(template_data, 'r') as stream:
    # The Templates index was originally written to create our accordians within the docs. Building the search app it was a good 
    # opportunity to include templates in search results, but their formatting (yaml) and attribute names (missing a documentID)
    #  do not match up perfectly.
    # 
    # This step cleans up that templates data file into a format that matches site indexes for docs, community, etc. so it can
    # actually be included. In the future, we can update the templates data file to always match the format here, but it would
    # require updating the accordian shortcode as well, so it has not been done yet. 
    try:
        data = yaml.safe_load(stream)

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

        with open(final_templates_location, 'w') as f:
            json.dump(indexData, f)

    except yaml.YAMLError as exc:
        print(exc)

with open(docs_data) as docs_index:
    data = json.load(docs_index)
    with open(final_docs_location, 'w') as f:
        json.dump(data, f)
