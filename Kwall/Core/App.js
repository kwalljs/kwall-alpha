/**
 * Module dependencies.
 * 
 * @private
 */
const Express = require('express');
const Config = Use('Kwall/Config');

/**
 * App Class.
 * Returns the app instance.
 * 
 * @class
 */
class App {
  constructor() {
    this._app = Express();
    this._port = process.env.PORT || Config.get('server', 'port') || 3000;
  }

  get getApp() {
    return this._app;
  }

  get getPort() {
    return this._port;
  }
}

/**
 * Module exports.
 * 
 * @public
 */
module.exports = App;