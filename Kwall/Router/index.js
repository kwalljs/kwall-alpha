/**
 * Module dependencies.
 * 
 * @private
 */
const Path = require('path');
const Fs = require('fs');
const Kwall = Use('Kwall');
const App = Use('App').getApp;

/**
 * Router Class
 */
class Router {
  initialize() {
    if (! Fs.existsSync(Path.join(Kwall.appPath, 'routes.js'))) return;
    require(Path.join(Kwall.appPath, 'routes.js'));
  }

  _request(path, callback, method) {
    App[method](path, (req, res, next) => {
      if (typeof callback === 'string') {
        return this._requestCallbackController(path, callback, req, res, next);
      }
  
      if (typeof callback === 'function') {
        return this._requestCallbackFunction(path, callback, req, res, next);
      }
  
      throw new TypeError(`The second parameter of route "${path}" expects to be a function or string.`);
    });
  }

  _requestCallbackFunction(path, callback, req, res, next) {
    try {
      callback.call(null, req, res, next);
      return true;
    } catch (error) {
      throw new TypeError(`The callback passed to route "${path}" is not valid.`);
    }
  }

  _requestCallbackController(path, callback, req, res, next) {
    let controller = {
      name: undefined,
      action: 'index'
    };

    if (/@/.test(callback)) {
      const splitedController = callback.split('@');

      controller.name = splitedController[0];
      controller.action = splitedController[1] || 'index';
    } else {
      controller.name = callback;
    }

    if (! /Controller$/.test(controller.name)) {
      throw new Error(`The controller name "${callback}" is not valid. It should contain "Controller" at the end.`);
    }

    const controllerPath = Path.join(Kwall.appPath, 'controllers', `${controller.name}.js`);
    if (! Fs.existsSync(controllerPath)) {
      throw new Error(`Controller "${controller.name}" does not exist.`);
    }

    const controllerInstance = new (require(controllerPath))();
    
    /** 
     * Performs the current action in the context of the controller.
     */
    if (! controllerInstance[controller.action]) {
      throw new Error(`The "${controller.action}" action of the "${controller.name}" controller does not exist.`);
    }

    if (typeof controllerInstance[controller.action] !== 'function') {
      throw new Error(`The "${controller.action}" action of the "${controller.name}" controller is not valid.`);
    }

    try {
      controllerInstance[controller.action](req, res, next);
    } catch (error) {
      throw new Error(`[Error : ${controller.name} : ${controller.action}] ${error}`);
    }
  }

  /**
   * HTTP request methods:
   * 
   * @param {string} path
   * @param {string|function} callback
   */
  get(path, callback) { this._request(path, callback, 'get'); }
  put(path, callback) { this._request(path, callback, 'put'); }
  post(path, callback) { this._request(path, callback, 'post'); }
  head(path, callback) { this._request(path, callback, 'head'); }
  patch(path, callback) { this._request(path, callback, 'patch'); }
  delete(path, callback) { this._request(path, callback, 'delete'); }
  options(path, callback) { this._request(path, callback, 'options'); }
  connect(path, callback) { this._request(path, callback, 'connect'); }
}

/**
 * Module exports.
 * 
 * @public
 */
module.exports = Router;