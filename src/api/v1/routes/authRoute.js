const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const auth = require('../middlewares/authentication')
const admin = require('../middlewares/admin');
// route prefix: /api/auth/

router.delete('/test_1', authController.test_1);

// FOR SERVICES
router.post('/auth', authController.authAccount); 
router.post('/account', authController.createAccount); // called by User Service
router.put('/account', auth, authController.updateAccount);

// FOR ADMIN
router.get('/admin/accounts', [auth, admin], authController.getAllAccounts);
router.get('/admin/accounts/editStatus/:accountId', [auth, admin], authController.editAccountStatus);


// router.post('/admin/account', [auth, admin], authController.createAccountByAdmin); 
router.post('/admin/account', authController.createAccountByAdmin); 
router.get('/admin/account/:accountId', [auth, admin], authController.getAccount);
router.get('/admin/account/byUserId/:userId', [auth, admin], authController.getAccountByUserId);
router.delete('/admin/account/:accountId', [auth, admin], authController.deleteAccount);

module.exports = router;

