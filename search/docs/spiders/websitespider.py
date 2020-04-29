import scrapy
from docs.items import DocsItem
from urllib.parse import urljoin
from scrapy.selector import Selector
from scrapy.http.request import Request
from pprint import pprint
import hashlib
import re

class WebsiteSpider(scrapy.Spider):
    rank = 4
    name = 'website'
    allowed_domains = ['platform.sh']
    start_urls = ['https://platform.sh/', 'https://platform.sh/product/demos/']
    default_section = "Platform.sh"

    seen = set()

    def get_section(self, section, subsection):

        remove_dashes = section.split("-")
        year_section = False
        try:
            year_section = int(remove_dashes[0])
            return self.default_section
        except:
            new_section = " ".join([ f.title() for f in remove_dashes])
            if new_section == "Product" and subsection == "demos":
                return "Demos"
            elif new_section == "Tos":
                return "Terms of Service"
            elif new_section == "Customers":
                return "Customer story"
            elif new_section == "Webinars":
                return "Webinar"
            else:
                return new_section

    def parse(self, response):
        hxs = Selector(response)
        if response.url in self.seen:
            self.log('already seen  %s' % response.url)
        else:
            self.log('parsing  %s' % response.url)
            self.seen.add(response.url)
        for url in hxs.xpath('//a/@href').extract():
            url = urljoin(response.url, url)
            if not url in self.seen and not re.search(r'.(pdf|zip)$', url) and url.startswith( self.start_urls[0] ):
                self.log("yielding request " + url)
                yield Request(url, callback=self.parse)
        item = DocsItem()
        item['site'] = self.name
        if len(response.url.split("/")) >= 5:
            item['section'] = self.get_section(response.url.split("/")[3], response.url.split("/")[4])
        else:
            item['section'] = self.default_section
        if item['section'] == "Demos":
            item['title'] = hxs.xpath('.//h1/text()').get()
        else:
            item['title'] = hxs.xpath('//title/text()').get().replace('| Platform.sh', '')
        item['url'] = response.url
        item['documentId'] = hashlib.sha1(str(response.url).encode('utf-8')).hexdigest()
        item['text'] =  " ".join(response.xpath('.//div[contains(@class,"container-fluid") and not(contains(@class,"footer"))]//text()').getall())
        item['rank'] = self.rank
        yield item
