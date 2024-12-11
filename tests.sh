#!/usr/bin/env bash
clear
SITE=$1

######################
# CHECK INTERNAL LINKS

cd sites/$SITE
pwd

# 1. Install dependencies
npm ci

# 2. Build search script
npm run build:search

# 3. Build Hugo site
hugo

# 4. Check links in Markdown
curl https://htmltest.wjdp.uk | bash
bin/htmltest

# 5. Linting (Lint markdown)
npm run lint:markdown

# 6. Linting (Lint prose)
vale src
