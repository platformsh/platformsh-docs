import os
import glob
import json
import meilisearch
from platformshconfig import Config

import sys

docs_index_name = sys.argv[1]


class Search:
    def __init__(self):
        self.default = {
            "host": "http://127.0.0.1",
            "key": None,
            "port": 7700
        }

        self.scrape_dir = "output"
        self.scrape_config = "config/scrape.json"
        self.docs_index = "{0}_docs".format(docs_index_name)
        self.primaryKey = "documentId"
        self.index_name = "Docs ({0})".format(docs_index_name)

        # Below are Platform.sh custom settings for how the search engine functions.

        # Data available to the dropdown React app in docs, used to fill out autocomplete results.
        self.displayed_attributes = ['keywords', 'title', 'text', 'url', 'site', 'section']
        # Data actually searchable by our queries.
        self.searchable_attributes = ['keywords', 'title', 'pageUrl', 'section', 'text', 'url']

        # Show results for one query with the listed pages, when they by default would not show up as best results.
        # Note: these aren't automatically two-way, which is why they're all defined twice.
        self.synonyms = {
            "cron": ["crons"],
            "crons": ["cron tasks", "cron jobs"],
            "e-mail": ["email"],
            "routes.yaml": ["routes"],
            "routes": ["routes.yaml"],
            "services": ["services.yaml"],
            "services.yaml": ["services"],
            "application": [".platform.app.yaml", "app.yaml", "applications.yaml"],
            ".platform.app.yaml": ["application"],
            "app.yaml": ["application"],
            "applications.yaml": ["application", "multi-app"],
            "multi-app": ["applications.yaml"],
            "regions": ["public ip addresses"],
            "public ip addresses": ["regions"],
            "ssl": ["https", "tls"],
            "https": ["ssl"],
            "auth": ["authentication", "access control"], # Only needs to be one way since we don't use "auth" in the docs
        }

        # Ranking rules:
        #
        #   - Default order: ["words", "typo", "proximity", "attribute", "sort", "exactness"]
        #
        #   - words: number of times query is in document (greater number gets priority)
        #   - typo: fewer typos > more typos
        #   - proximity: smaller distance between multiple occurences of query in same document > larger distances
        #   - attribute: sorted according to order of importance of attributes (searchable_attributes). terms in
        #       more important attributes first.
        #   - sort: queries are sorted at query time
        #   - exactness: similarity of matched words in document with query

        self.ranking_rules = ["rank:asc", "exactness", "attribute", "proximity", "typo", "words"]

        self.updated_settings = {
            "rankingRules": self.ranking_rules,
            "searchableAttributes": self.searchable_attributes,
            "displayedAttributes": self.displayed_attributes
        }

        # Group results by page
        self.distinct_attribute = "pageUrl"

    def getConnectionString(self):
        """
        Sets the Meilisearch host string, depending on the environment.

        Returns:
            string: Meilisearch host string.
        """
        if os.environ.get('PORT'):
            return "{}:{}".format(self.default["host"], os.environ['PORT'])
        else:
            return "{}:{}".format(self.default["host"], self.default["port"])

    def getMasterKey(self):
        """
        Retrieves the Meilisearch master key, either from the Platform.sh environment or locally.
        """
        config = Config()
        if config.is_valid_platform():
            return config.projectEntropy
        elif os.environ.get("MEILI_MASTER_KEY"):
            return os.environ["MEILI_MASTER_KEY"]
        else:
            return self.default["key"]

    def add_documents(self, index):
        """
        Cycle through the individual site indexes in /outputs so their individual documents can be added to Meilisearch.
        """
        documents = [f for f in glob.glob("{0}/{1}_*.json".format(self.scrape_dir, docs_index_name))]
        for doc in documents:
            self.add(doc, index)

    def add(self, doc, index):
        """
        Add an individual site's index to the Meilisearch service.
        """
        with open(doc) as scraped_index:
            data = json.load(scraped_index)
            index.add_documents(data)

    def update(self):
        """
        Updates the Meilisearch index.
        """
        # Create a Meilisearch client.
        client = meilisearch.Client(self.getConnectionString(), self.getMasterKey())

        # Delete previous index
        if len(client.get_indexes()):
            client.index(self.docs_index).delete()

        # Create a new index
        create_index_task = client.create_index(uid=self.docs_index, options={'primaryKey': self.primaryKey, 'uid': self.index_name})

        timeout = 10000
        if "friday" == docs_index_name:
          timeout = 15000

        try:
          client.wait_for_task(create_index_task['taskUid'], timeout)
        except meilisearch.errors.MeilisearchTimeoutError as merror:
          print('Failed waiting {0} milliseconds for Meilisearch to create the index. Error message: {1}'.format(timeout, merror))
          return

        index = client.get_index(create_index_task['indexUid'])

        # Add synonyms for the index
        index.update_synonyms(self.synonyms)

        # Update its settings: what can be searched, what's displayable, and how results should be ranked.
        index.update_settings(self.updated_settings)

        # Update distinct attribute.
        index.update_distinct_attribute(self.distinct_attribute)

        # Add documents to the index
        self.add_documents(index)

if __name__ == "__main__":
    meili = Search()
    meili.update()
