const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'k7k61v',
  e2e: {
    baseUrl: 'http://localhost:1313/',
    env: {
      site: 'not set',
      environment: "local",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    blockHosts: [
      'www.googletagmanager.com',
      'cdn.cookielaw.org',
      'cdn.heapanalytics.com',
      'heapanalytics.com',
      'cdn.matomo.cloud',
    ],
  },
});
