# This file contains build steps that need to be run offline, not as part of
# The Platform.sh build process.

all: graphs

graphs: build-pipeline

build-pipeline:
	dot -Tsvg -osrc/images/workflow/build-pipeline.svg src/images/workflow/build-pipeline.dot


