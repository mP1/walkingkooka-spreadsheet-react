const { defineConfig } = require('cypress')

module.exports = defineConfig({
  numTestsKeptInMemory: 200,
  retries: {
    runMode: 1,
    openMode: 1,
  },
  projectId: 'q93cje',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
