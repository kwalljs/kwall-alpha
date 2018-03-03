/**
 * Module dependencies.
 * 
 * @private
 */
const ExpressSession = require('express-session');
const CookieParser = require('cookie-parser');
const RequireAll = require('require-all');
const BodyParser = require('body-parser');
const Express = require('express');
const Helmet = require('helmet');
const Path = require('path');
const Fs = require('fs');
const Config = Use('Kwall/Config');
const Kwall = Use('Kwall');
const App = Use('Kwall/Core/App').getApp;

/**
 * Middleware Class.
 * Manages the application middlewares.
 * 
 * @class
 */
class Middleware {
  /**
   * Class constructor.
   * 
   * @constructor
   */
  constructor() {
    this._setMiddlewares();
  }

  /**
   * Sets a global middleware.
   * 
   * @param {function} callback 
   */
  set(callback) {
    App.use((req, res, next) => {
      callback.call(null, req, res, next);

      next();
    });
  }

  /**
   * Gets the user-defined middlewares.
   */
  getUserMiddlewares() {
    if (! Fs.existsSync(Path.join(Kwall.appPath, 'middlewares'))) return;

    RequireAll({
      dirname    :  Path.join(Kwall.appPath, 'middlewares'),
      filter     :  /^(.+)\.js$/
    });
  }

  /**
   * Sets application's required middlewares.
   */
  _setMiddlewares() {
    /**
     * Sets the helmet middleware.
     */
    App.use(Helmet());

    /**
     * Sets the static content.
     */
    App.use(Express.static(`${Kwall.basePath}/public`));

    /**
     * Sets the cookies:
     */
    App.use(CookieParser());

    /**
     * Sets the body parser middleware.
     */
    App.use(BodyParser.urlencoded({ extended: true }));
    App.use(BodyParser.json());

    /**
     * Sets the express session middleware.
     */
    App.use(ExpressSession({
      secret: Config.get('session', 'secretKey') || '8bc0dff50e967cc4caedc09573b07f75',
      resave: Config.get('session', 'resave') || false,
      saveUninitialized: Config.get('session', 'saveUninitialized') || false
    }));

    App.use((req, res, next) => {
      res.set('X-Powered-By', 'Kwall.JS');
      
      next();
    });
  }
}

/**
 * Module exports.
 * 
 * @public
 */
module.exports = Middleware;