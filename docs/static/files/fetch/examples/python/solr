
import pysolr
from xml.etree import ElementTree as et
from platformshconfig import Config


def usage_example():

    # Create a new Config object to ease reading the Platform.sh environment variables.
    # You can alternatively use os.environ yourself.
    config = Config()

    # Get the credentials to connect to the Solr service.
    credentials = config.credentials('solr')

    try:
        formatted_url = config.formatted_credentials('solr', 'pysolr')

        # Create a new Solr Client using config variables
        client = pysolr.Solr(formatted_url)

        # Add a document
        message = ''
        doc_1 = {
            "id": 123,
            "name": "Valentina Tereshkova"
        }

        result0 = client.add([doc_1])
        client.commit()
        message += 'Adding one document. Status (0 is success): {0} <br />'.format(et.fromstring(result0)[0][0].text)

        # Select one document
        query = client.search('*:*')
        message += '\nSelecting documents (1 expected): {0} <br />'.format(str(query.hits))

        # Delete one document
        result1 = client.delete(doc_1['id'])
        client.commit()
        message += '\nDeleting one document. Status (0 is success): {0}'.format(et.fromstring(result1)[0][0].text)

        return message

    except Exception as e:
        return e
