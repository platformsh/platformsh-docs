import scrapy
from docs.items import DocsItem
from urllib.parse import urljoin
from scrapy.selector import Selector
from scrapy.http.request import Request
from pprint import pprint
import hashlib
import re

class ApidocsSpider(scrapy.Spider):
    rank = 5
    name = 'apidocs'
    allowed_domains = ['api.platform.sh']
    start_urls = ['https://api.platform.sh/docs/']

    def get_section(self, url):
        init_section = url.split("#tag/")[len(url.split("#tag/"))-1].split("/")[0]
        if init_section.split("/")[0] == "#operation":
            return None
        elif init_section.split("/")[0] == "#section":
            return "API - " + " ".join(url.split("#tag/")[len(url.split("#tag/"))-1].split("/")[1].split("-"))
        else:
            return "API - " + " ".join(init_section.split("-"))

    def parse(self, response):
        sections = response.xpath('.//div[contains(@class,"api-content")]/div')
        for index, section in enumerate(sections):
            title = section.xpath('.//h2/text()').get()
            url = section.xpath('.//h2/a/@href').get()
            text = section.xpath('.//p/text()').getall()
            if title is not None and url is not None and text is not None:
                endpoint_section = self.get_section(url)
                if endpoint_section is not None:
                    item = DocsItem()
                    item['site'] = self.name
                    item['title'] = title
                    item['url'] = self.start_urls[0] + url
                    item['section'] = endpoint_section
                    item['documentId'] = hashlib.sha1(str( item['url']).encode('utf-8')).hexdigest()
                    item['text'] =  " ".join(text)
                    item['rank'] = self.rank
                    item['subsections'] = ""
                    yield item
