const router = require('express').Router();
const controllerEmployee = require('../controllers/controller-employee');
const auth = require('../auth/controller-auth');

router.put('/api/password-update',auth.authenticateToken,controllerEmployee.updatePassword);
router.get('/api/employees/:id',controllerEmployee.getEmployee);
router.put('/api/update',auth.authenticateToken,controllerEmployee.updateEmployee);

module.exports = router;