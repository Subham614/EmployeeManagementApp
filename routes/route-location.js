const router = require('express').Router();
const locationController = require('../controllers/controller-location');
const auth = require('../auth/controller-auth');


router.post('/current',auth.authenticateToken,locationController.saveCurrentLocation);
router.get('/today/:id',locationController.getlocationDetails);
module.exports = router;