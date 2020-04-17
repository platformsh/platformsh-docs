import scrapy
from docs.items import DocsItem
from urllib.parse import urljoin
from scrapy.selector import Selector
from scrapy.http.request import Request
from pprint import pprint
import hashlib
import re

class ApidocsSpider(scrapy.Spider):
    name = 'apidocs'
    allowed_domains = ['api.platform.sh']
    start_urls = ['https://api.platform.sh/docs/']

    def parse(self, response):
        sections = response.xpath('.//div[contains(@class,"api-content")]/div')
        for index, section in enumerate(sections):
            title = section.xpath('.//h2/text()').get()
            url = section.xpath('.//h2/a/@href').get()
            text = section.xpath('.//p/text()').getall()
            if title is not None and url is not None and text is not None:
                item = DocsItem()
                item['site'] = self.name
                item['title'] = title
                item['url'] = self.start_urls[0] + url
                item['documentId'] = hashlib.sha1(str( item['url']).encode('utf-8')).hexdigest()
                item['text'] =  " ".join(text)
                yield item