import json
import yaml
import hashlib
from platformshconfig import Config

config = Config()

if config.is_valid_platform():
    template_data = "config/templates.yaml"
else:
    template_data = "../docs/data/templates.yaml"

final_index_location = "output/templates.json"

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

        with open(final_index_location, 'w') as f:
            json.dump(indexData, f)

    except yaml.YAMLError as exc:
        print(exc)
