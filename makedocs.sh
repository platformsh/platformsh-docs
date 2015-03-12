#!/bin/sh

make html
cd _build/html
python -m SimpleHTTPServer 8000
