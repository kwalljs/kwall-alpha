/**
 * Module dependencies.
 * 
 * @private
 */
const _ = require('lodash');
const RequireAll = require('require-all');
const Kwall = Use('Kwall');

/**
 * Config Class.
 * 
 * @class
 */
class Config {
  constructor() {
    this._files = this._getFiles();
  }

  get(fileName, key) {
    if (! fileName) {
      throw new TypeError(`
        "Config.get" expects a filename in the first parameter.
        The value of the first parameter was not passed.
      `);
    }

    if (! key) {
      throw new TypeError(`
        "Config.get" expects a config property in the second parameter.
        The value of the second parameter was not passed.
      `);
    }

    if (! this._files[fileName]) {
      throw new ReferenceError(`(Config.get) The config file "${fileName}" does not exist.`);
    }

    if (typeof this._files[fileName][key] === 'undefined') {
      throw new ReferenceError(`(Config.get) The config key "${key}" does not exist.`);
    }

    return this._files[fileName][key];
  }

  _getFiles() {
    return RequireAll({
      dirname    :  Kwall.configPath,
      filter     :  /^(.+)\.js$/,
      excludeDirs:  /^locales$/,
      map        : (name) => {
        if (/^i18n$/.test(name)) return name;

        return _.camelCase(name);
      }
    });
  }
}

/**
 * Module exports.
 * 
 * @public
 */
module.exports = Config;