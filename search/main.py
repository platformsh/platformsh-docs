import os
import glob
import json
import meilisearch
from platformshconfig import Config

class Search:
    def __init__(self):
        self.default = {
            "host": "http://127.0.0.1",
            "key": None,
            "port": 7700
        }

        self.scrape_dir = "output"
        self.scrape_config = "config/scrape.json"
        self.docs_index = "docs"
        self.primaryKey = "documentId"
        self.index_name = "Docs"

        # Below are Platform.sh custom settings for how the search engine functions.

        # Data available to the dropdown React app in docs, used to fill out autocomplete results.
        self.displayed_attributes = ['title', 'text', 'url', 'site', 'section']
        # Data actually searchable by our queries.
        self.searchable_attributes = ['title', 'pageUrl', 'text', 'url', 'section']

        # Show results for one query with the listed pages, when they by default would not show up as best results. Note: these
        # are not automatically two-way, so that's why they all appear to be defined twice.
        self.synonyms = {
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
        }

        # Ranking rules:
        #
        #   - Default order: ["typo", "words", "proximity", "attribute", "wordsPosition", "exactness"]
        #
        #   - typo: fewer typos > more typos
        #   - words: number of times query is in document (greater number gets priority)
        #   - proximity: smaller distance between multiple occurences of query in same document > larger distances
        #   - attribute: sorted according to order of importance of attributes (searchable_attributes). terms in
        #       more important attributes first.
        #   - wordsPosition: query terms earlier in document > later in document
        #   - exactness: similarity of matched words in document with query

        self.ranking_rules = ["asc(rank)", "attribute", "typo", "words", "proximity", "wordsPosition", "exactness"]

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
        documents = [f for f in glob.glob("{}/*.json".format(self.scrape_dir))]
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
            client.get_index(self.docs_index).delete()

        # Create a new index
        index = client.create_index(uid=self.docs_index, options={'primaryKey': self.primaryKey, 'uid': self.index_name})

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
