//modules: require
const express = require('express');
const {
  login,
  verify,
  forgotPassword,
  resetPassword,
  info,
  // addClients,
  // signout,
  // multiLogin,
  // loginWithPreviousRevoke,
} = require('../controllers/auth-controller');

const auth = require('../middlewares/auth');

//Router: instance
const router = express.Router();

/**
 * @method POST
 * @controllerMethod login
 */
router.post('/login', login);

/**
 * @method POST
 * @controllerMethod multiLogin
 */
// router.post('/multi-login', multiLogin);

/**
 * @method POST
 * @controllerMethod loginWithPreviousRevoke
 */
// router.post('/login-with-revoke', loginWithPreviousRevoke);

/**
 * @method POST
 * @controllerMethod verify
 */
router.post('/verify', verify);

/**
 * @method POST
 * @controllerMethod forgotPassword
 */
router.post('/password/forgot', forgotPassword);

/**
 * @method POST
 * @controllerMethod resetPassword
 */
router.post('/password/reset', resetPassword);

/**
 * @method GET
 * @controllerMethod info
 */
router.get('/info', auth, info);

/**
 * @method GET
 * @controllerMethod signout
 */
// router.get('/signout', signout);

// router.get('/generate-tokens', addClients);

//module: export
module.exports = router;