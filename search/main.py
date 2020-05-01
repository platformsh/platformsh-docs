import os
import glob
import json
import meilisearch

class XSSearch:
    def __init__(self):
        self.localhost = "http://127.0.0.1"
        self.default_port = "7700"
        self.host = self.get_host()

        self.scrape_dir = "output"
        # self.scrape_dir = "final"
        self.scrape_config = "config/scrape.json"

        self.public_key_file = "config/config.json"

        self.docs_index = "docs"
        self.primaryKey = "documentId"
        self.index_name = "Docs"

        self.displayed_attributes = ['title', 'text', 'url', 'site', 'section']
        self.searchable_attributes = ['title', 'subsections', 'text', 'section']

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
            "public ip addresses": ["regions"]
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

        # self.ranking_rules = [ "typo", "words", "proximity", "asc(rank)", "attribute", "wordsPosition", "exactness"]
        self.ranking_rules = ["asc(rank)", "attribute", "typo", "words", "proximity", "wordsPosition", "exactness"]

        self.updated_settings = {
            "rankingRules": self.ranking_rules,
            "searchableAttributes": self.searchable_attributes,
            "displayedAttributes": self.displayed_attributes
        }

    def get_host(self):
        """
        Sets the Meilisearch host string, depending on the environment.

        Returns:
            string: Meilisearch host string.
        """
        port = 7700
        if self.env() == 'prod' or os.environ.get('PORT'):
            port = os.environ['PORT']
        return "{}:{}".format(self.localhost, port)

    def env(self):
        """
        Sets the Meilisearch environment, depending on the presence of a master key.

        Returns:
            string: 'prod' if MEILI_MASTER_KEY is set, 'dev' otherwise.
        """
        if os.environ.get('MEILI_MASTER_KEY')==None:
            return 'dev'
        elif os.environ.get('PORT')==None:
            os.environ['PORT'] = self.default_port
            return 'prod'
        else:
            return 'prod'

    def update(self):
        """
        Updates the Meilisearch index.
        """

        print("- Updating index...")
        print("     * Meilisearch server: {}".format(self.host))
        print("     * Environment: {}".format(self.env()))

        # Forego master and search keys during local dev.

        # Production
        if self.env() == 'prod':
            # Define the client
            client = meilisearch.Client(self.host, os.environ['MEILI_MASTER_KEY'])

            # Retrieve the search only api key and write to the config.json file
            config = {}
            config["public_api_key"]=client.get_keys()["public"]
            with open(self.public_key_file, 'w') as outfile:
                json.dump(config, outfile)

        # Local dev
        else:
            # Define the client
            client = meilisearch.Client(self.host)

        # Delete previous index
        if len(client.get_indexes()):
            client.get_index(self.docs_index).delete()

        # Create a new index
        index = client.create_index(uid=self.docs_index, primary_key=self.primaryKey, name=self.index_name)

        # Add synonyms for the index
        index.update_synonyms(self.synonyms)

        # Update its settings: what can be searched, what's displyable, and how results should be ranked.
        index.update_settings(self.updated_settings)

        # Add documents to the index
        self.add_documents(index)

    def add_documents(self, index):
        documents = [f for f in glob.glob("{}/*.json".format(self.scrape_dir))]
        for docs in documents:
            self.add(docs, index)

    def add(self, docs, index):
        with open(docs) as scraped_index:
            data = json.load(scraped_index)
            response = index.add_documents(data)


xss = XSSearch()
xss.update()
