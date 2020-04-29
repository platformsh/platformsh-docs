import json
from platformshconfig import Config

config = Config()

public_key_file = "config/config.json"

with open(public_key_file) as json_data:
    data = json.load(json_data)

    if config.is_valid_platform():
        data['url'] = "{}indexes/docs/search".format(config.get_route("search")['url'])
    else:
        public_key_file = "../docs/static/scripts/xss/dist/config/config.json"
        data['url'] = "http://127.0.0.1:7700/indexes/docs/search"

    print("Saving Meilisearch configuration to {}:".format(public_key_file))
    print(data)

    with open(public_key_file, 'w') as json_file:
        json.dump(data, json_file)
