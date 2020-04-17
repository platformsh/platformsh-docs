import os
import glob
import json
import meilisearch

class XSSearch:
    def __init__(self):
        self.docs_index = "docs"
        self.primaryKey = "documentId"
        self.index_name = "Docs"
        self.displayed_attributes = ['title', 'text', 'url', 'site']
        self.searchable_attributes = ['title', 'text', 'site']
        self.host = "http://127.0.0.1:{}".format(os.environ['PORT'])

    def update(self):

        print("Updating index...")

        client = meilisearch.Client(self.host, os.environ['MEILI_MASTER_KEY'])
        config = {}
        config["public_api_key"]=client.get_keys()["public"]
        with open(os.environ['PLATFORM_APP_DIR']+"/public/scripts/xss/dist/config/config.json", 'w') as outfile:
            json.dump(config, outfile)

        # Delete previous index
        if len(client.get_indexes()):
            client.get_index(self.docs_index).delete()

        # Create a new index
        index = client.create_index(uid=self.docs_index, primary_key=self.primaryKey, name=self.index_name)

        # Add documents to the index
        self.add_documents(index)

    def add_documents(self, index):
        documents = [f for f in glob.glob(os.environ['PLATFORM_APP_DIR']+"/meilisearch/output/*.json")]
        for docs in documents:
            self.add(docs, index)

    def add(self, docs, index):
        with open(docs) as scraped_index:
            data = json.load(scraped_index)
            response = index.add_documents(data)

xss = XSSearch()
xss.update()
