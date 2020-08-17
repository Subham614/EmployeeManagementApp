const router = require('express').Router();
const controllerEmployee = require('../controllers/controller-employee');

router.put('/api/password-update',controllerEmployee.updatePassword);


module.exports = router;