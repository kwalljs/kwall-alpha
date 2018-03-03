/**
 * Module dependencies.
 * 
 * @private
 */
const Path = require('path');
const Fs = require('fs');

/**
 * Loader Class.
 * Sets and loads application content.
 * 
 * @class
 */
class Loader {
  /**
   * Class constructor.
   * Creates the list of aliases.
   * 
   * @constructor
   */
  constructor() {
    this._list = {};
    this._shortcut_list = undefined;
  }

  /**
   * Loads an alias.
   * 
   * @param {string} aliasName 
   * @return {*}
   */
  load(aliasName) {
    if (! aliasName) {
      throw new TypeError(`
        "Loader.load" expects an alias name in the first parameter.
        The value of the first parameter was not passed.
      `);
    }

    /** If the shortcuts have already been defined. */
    if (! this._list[aliasName] && this._shortcut_list !== undefined) {
      if (!! this._shortcut_list[aliasName]) {
        aliasName = this._shortcut_list[aliasName];
      }
    }
  
    if (! this._list[aliasName]) {
      throw new ReferenceError(`(Loader.load) The alias "${aliasName}" does not exist.`);
    }

    return this._list[aliasName];
  }

  /**
   * Sets an alias.
   * 
   * @param {string} aliasName 
   * @param {*} content 
   */
  set(aliasName, content) {
    if (! aliasName) {
      throw new TypeError(`
        "Loader.set" expects an alias name in the first parameter.
        The value of the first parameter was not passed.
      `);
    }

    if (typeof aliasName !== 'string') {
      throw new ReferenceError(`(Loader.set) The alias name (${aliasName}) must be a string.`);
    }

    if (! content) {
      throw new TypeError(`
        "Loader.set" expects an content in the second parameter.
        The value of the second parameter was not passed.
      `);
    }

    if (!! this._list[aliasName]) {
      throw new ReferenceError(`(Loader.set) The alias "${aliasName}" already exists.`);
    }

    this._list[aliasName] = content;
  }

  /**
   * Sets the aliases shortcuts.
   */
  setAliasesShortcuts() {
    if (! Fs.existsSync(Path.join(__dirname, 'aliases-list.json'))) return false;

    if (this._shortcut_list === undefined) {
      this._shortcut_list = {};
    }

    const Aliases = require('./aliases-list.json');

    for (let aliasName in Aliases) {
      let shortcut = Aliases[aliasName];

      this._shortcut_list[shortcut] = String(aliasName);
    }
  }
}

/**
 * Module exports.
 * 
 * @public
 */
module.exports = Loader;