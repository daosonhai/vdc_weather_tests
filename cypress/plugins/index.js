/// <reference types="cypress" />

const { addMatchImageSnapshotPlugin, } = require('cypress-image-snapshot/plugin');

const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);

  // on('before:browser:launch', (browser, launchOptions) => {
  //   if (browser.isHeadless) {
  //     launchOptions.args.push('--window-size=1000,660')
  //     return launchOptions
  //   }
  // })

  const file = config.env.configFile || 'production';

  return getConfigurationByFile(file);
};