import json
import yaml
import hashlib
from platformshconfig import Config

config = Config()

if config.is_valid_platform():
    template_data = "config/templates.yaml"
    docs_data = "config/index.json"
else:
    template_data = "../docs/data/templates.yaml"
    docs_data = "../docs/public/index.json"

final_templates_location = "output/templates.json"
final_docs_location = "output/docs.json"

with open(template_data, 'r') as stream:
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

                indexData.append(temp)

        with open(final_templates_location, 'w') as f:
            json.dump(indexData, f)

    except yaml.YAMLError as exc:
        print(exc)

with open(docs_data) as docs_index:
    data = json.load(docs_index)
    with open(final_docs_location, 'w') as f:
        json.dump(data, f)
