const router = require('express').Router();
const controller = require('../controllers/controller-attendence');
const auth = require('../auth/controller-auth');

router.post('/check-in',auth.authenticateToken,controller.checkIn);
router.get('/details/:id',controller.attendenceDetails);
router.get('/monthly-report/:id',controller.monthlyAttendence);
router.put('/check-out',auth.authenticateToken,controller.checkOut);


module.exports = router;