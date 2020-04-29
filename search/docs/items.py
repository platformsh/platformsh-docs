from scrapy.item import Item, Field

class DocsItem(Item):
    rank = Field()
    site = Field()
    documentId = Field()
    title = Field()
    url = Field()
    text = Field()
    section = Field()
