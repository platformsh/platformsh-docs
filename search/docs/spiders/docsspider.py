import scrapy
from docs.items import DocsItem
from urllib.parse import urljoin
from scrapy.selector import Selector
from scrapy.http.request import Request
from pprint import pprint
import hashlib
import re

class DocsSpider(scrapy.Spider):
    rank = 1
    name = 'docs'
    allowed_domains = ['docs.platform.sh']
    start_urls = ['https://docs.platform.sh/']
    # allowed_domains = ['localhost:1313/']
    # start_urls = ['http://localhost:1313/']

    seen = set()

    section_replacements = {
        "gettingstarted": "Getting started",
        "bestpractices": "Best practices",
        "golive": "Go live",
        "ez": "eZ Platform",
        "php": "PHP",
        "nodejs": "Node.js",
        "cli": "CLI",
        "cdn": "CDN",
        "steps": "Go live steps",
        "typo3": "TYPO3"
    }

    priority_section = ["gettingstarted", "dedicated"]

    def section_transform(self, split_section):
        if split_section in self.section_replacements:
            return self.section_replacements[split_section]
        else:
            return split_section.title()


    def get_section(self, url_sections):
        if len(url_sections) == 3 or url_sections[1] in self.priority_section:
            return self.section_transform(url_sections[1])
        else:
            return self.section_transform(url_sections[2])


    def parse(self, response):
        hxs = Selector(response)
        if response.url in self.seen:
            self.log('already seen  %s' % response.url)
        else:
            self.log('parsing  %s' % response.url)
            self.seen.add(response.url)
        for url in hxs.xpath('//a/@href').extract():
            # print(url)
            url = urljoin(response.url, url)
            if not url in self.seen and not re.search(r'.(pdf|zip)$', url) and url.startswith( self.start_urls[0] ):
                # print("--> makes to request {}".format(url))
                self.log("yielding request " + url)
                yield Request(url, callback=self.parse)
        item = DocsItem()
        item['site'] = self.name

        split_section = response.url.split("//")[1].split("/")
        if len(split_section) > 2:
            item['section'] = self.get_section(split_section)
        else:
            item['section'] = "Docs"

        item['title'] = hxs.xpath('//title/text()').get().replace(' · Platform.sh Documentation', '')
        item['url'] = "/{}".format("/".join(split_section[1:]))
        item['documentId'] = hashlib.sha1(str(response.url).encode('utf-8')).hexdigest()
        item['text'] = re.sub(r'<.*?>', '', ' '.join(hxs.css('.page-wrapper').extract()))
        item['rank'] = self.rank
        yield item
