GITBOOK_VERSION = 3.2

all: gitbook-fetch

# Download Gitbook itself and any plugins specified.
gitbook-fetch:
	gitbook install
	gitbook fetch $(GITBOOK_VERSION)


build: gitbook-fetch
	gitbook build


