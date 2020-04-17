## Running locally

In one terminal:

```
export PORT=7770
export MEILI_MASTER_KEY=S456FGDSDFGKUY4
./build.sh
./meilisearch
```

In another terminal:

```
./scrape.sh
pipenv run python main.py
```
