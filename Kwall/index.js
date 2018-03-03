/**
 * Module dependencies.
 * 
 * @private
 */
const Path = require('path');

/**
 * Kwall Class.
 * Initializes the app.
 * 
 * @class
 */
class Kwall {
  /**
   * Class constructor.
   * 
   * @constructor
   * 
   * @param {string} path 
   */
  constructor(path) {
    this._base_path = path;
  }


  /**
   * Initializes and returns the application port.
   * 
   * @param {function} callback
   * @return {int}
   */
  initialize(callback) {
    try {
      this._setAlises(() => {
        const App = Use('Kwall/Core/App');
        const Port = App.getPort;
  
        /**
         * Initializes the server.
         */
        App.getApp.listen(Port, () => {
          callback.call(null, null, Port);
        });
      });
    } catch (error) {
      callback.call(null, error, null);
    }
  }

  /**
   * Defines the aliases and executes the dependencies of the application.
   * 
   * @private
   * 
   * @param {function} callback
   */
  _setAlises(callback) {
    /**
     * Imports, executes and sets the Loader class alias.
     */
    const Loader = new (require('./Loader'))();
    Loader.set('Kwall/Loader', Loader);

    /**
     * Defines the alias of this class.
     */
    Loader.set('Kwall', this);

    /**
     * Sets the global `Use` function.
     * 
     * @param {string} aliasName
     * @return {class}
     */
    global.Use = (aliasName => {
      return Loader.load(aliasName || null);
    });

    /**
     * Imports, executes and sets the Config class alias.
     */
    const Config = new (require('./Config'))();
    Loader.set('Kwall/Config', Config);

    /**
     * Imports, executes, and sets the App class alias.
     */
    const App = new (require('./Core/App'))();
    Loader.set('Kwall/Core/App', App);

    /**
     * Sets the aliases shortcuts:
     */
    Loader.setAliasesShortcuts();

    /**
     * Imports, executes, and sets the Middleware class alias.
     */
    const Middleware = new (require('./Core/Middleware'))();
    Loader.set('Kwall/Core/Middleware', Middleware);
    
    /**
     * Get the user-defined middlewares:
     */
    Middleware.getUserMiddlewares();

    /**
     * Imports, executes and sets the Router class alias.
     */
    const Router = new (require('./Router'))();
    Loader.set('Kwall/Router', Router);
    Router.initialize();

    /**
     * Executes a callback after all aliases have been defined.
     */
    callback.call(this);
  }

  /**
   * Gets the base path of the application.
   * 
   * @return {string}
   */
  get basePath() {
    return this._base_path;
  }

  /**
   * Gets the `app` directory path.
   */
  get appPath() {
    return Path.join(this._base_path, 'app');
  }

  /**
   * Gets the `config` directory path.
   */
  get configPath() {
    return Path.join(this._base_path, 'config');
  }
}

/**
 * Module exports.
 * 
 * @public
 */
module.exports = Kwall;