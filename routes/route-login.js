const router = require('express').Router();
const auth = require('../auth/controller-auth');


const controllerLogin = require('../controllers/controller-login');

router.post('/login',controllerLogin.loginUser);
router.get('/profile/:empid', auth.authenticateToken ,controllerLogin.profile);


module.exports = router;