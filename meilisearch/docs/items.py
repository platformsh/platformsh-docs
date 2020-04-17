from scrapy.item import Item, Field

class DocsItem(Item):
    site = Field()
    documentId = Field()
    title = Field()
    url = Field()
    text = Field()
