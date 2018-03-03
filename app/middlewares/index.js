/**
 * MIDDLEWARES -> index.js
 * 
 * This file will be loaded before the controllers and policies.
 * Use it if you want to define global actions for your application, such as setting a default header.
 */

const Middleware = Use('Middleware');

/**
 * Example:
 * 
 *     Middleware.set((req, res, next) => {
 *       if (!! req.session.user) {
 *         // Do stuff.
 * 
 *         return;
 *       }
 * 
 *       next();
 *     });
 *
 */

Middleware.set((req, res, next) => {
  res.set('X-Requested-At', Date.now());

  next();
});