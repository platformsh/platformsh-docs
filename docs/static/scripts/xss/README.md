## Getting Started

These instructions will get a copy of the project running on your local machine.

### Prerequisites

* Node.js

```
$ brew install node
```

* create a meilisearch read only API key (see README at root)


Clone the repo and install dependencies:

```
$ npm install
```
The 'dev' script is setup to pull an API_KEY from your bash environment. Define API_KEY:

```
$ export API_KEY=yourAPIkey
```

Finally, run the app on a local server. Application will automatically launch in your default browser:

```
$ npm run dev 
```

