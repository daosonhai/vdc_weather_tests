/// <reference types="cypress" />

const cucumber = require('cypress-cucumber-preprocessor').default
const { addMatchImageSnapshotPlugin, } = require('cypress-image-snapshot/plugin');

const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);

  on('file:preprocessor', cucumber())
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.isHeadless) {
      launchOptions.args.push('--window-size=1400,1200')
      return launchOptions
    }
  })

  const file = config.env.configFile || 'production';

  return getConfigurationByFile(file);
};