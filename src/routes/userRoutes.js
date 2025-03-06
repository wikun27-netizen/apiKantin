import express from 'express';

import { 
    validateCreateUser,
    validateLogin,
    validateTokenAndroid,
    validateRefreshToken,

    validateChangePassword,
    validateResetPassword,
    validateNonaktifkanUser,

    validateCreatePIN,
    validateChangePIN
 } from '../middleware/userMiddleware.js';

import {
    tes,
    
    userAllController,
    userAllListController,
    userDetailController,
    
	userLoginController,
    userTokenAndroidController,
    userRefreshToken,
    userNameHashController,
    userPhotoController,
	
    userCreateController,
    userChangePhotoController,
    userChangePasswordController,
    userResetPasswordController,
    nonaktifkanUserController,

    userSaldoController,
    userCreatePINController,
    userChangePINController
} from '../controllers/userControllers.js';

import { authToken } from '../middleware/tokenHandler.js';

const router = express.Router();

router.route('/tes')
    .post(tes);

router.route('/all')
    .get(authToken, userAllController);

router.route('/allList')
    .get(authToken, userAllListController);

router.route('/detail')
    .get(authToken, userDetailController);

router.route('/login')
    .post(validateLogin, userLoginController);

router.route('/tokenAndroid')
    .post(validateTokenAndroid, userTokenAndroidController);

router.route('/refreshToken')
    .post(validateRefreshToken, userRefreshToken);

router.route('/usernameHash')
    .get(authToken, userNameHashController);

router.route('/Photo')
    .get(authToken, userPhotoController);

router.route('/createUser')
    .post(validateCreateUser, userCreateController);

router.route('/ChangePhoto')
    .post(authToken, userChangePhotoController);

router.route('/ChangePassword')
    .post(validateChangePassword, userChangePasswordController);

router.route('/ResetPassword')
    .post(validateResetPassword, userResetPasswordController);

router.route('/nonaktifkan')
    .post(validateNonaktifkanUser, nonaktifkanUserController);

router.route('/saldo')
    .get(authToken, userSaldoController);

router.route('/CreatePIN')
    .post(validateCreatePIN, userCreatePINController);

router.route('/ChangePIN')
    .post(validateChangePIN, userChangePINController);

export default router;