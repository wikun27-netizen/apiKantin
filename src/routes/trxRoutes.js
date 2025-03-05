import express from 'express';

import { 
    validateSetSaldoPribadi,
    validateTopUp, 
    validateWithdraw,
    
    validateReq,
    validateReqStatus,
    validateKonfirmasiReq,
    
    validateRiwayatUser,

    validateKosonginSaldo,
    validateTambahinSaldoRole
} from '../middleware/trxMiddleware.js';

import {
    trxSetSaldoPribadiController,
    trxTopUpController,
    trxWithdrawController,

    trxReqController,
    trxReqStatusController,
    trxKonfirmasiReqController,

    trxRiwayatController,
    trxRiwayatUserController,

    kosonginSaldoRoleController,
    tambahinSaldoRoleController,

    postExporTransaksiController
} from '../controllers/trxControllers.js';
import { authToken } from '../middleware/tokenHandler.js';

const router = express.Router();

router.route('/SaldoPribadi')
    .post(validateSetSaldoPribadi, trxSetSaldoPribadiController);

router.route('/TopUp')
    .post(validateTopUp, trxTopUpController);

router.route('/Withdraw')
    .post(validateWithdraw, trxWithdrawController);

router.route('/req')
    .post(validateReq, trxReqController);

router.route('/reqStatus')
    .post(validateReqStatus, trxReqStatusController);

router.route('/konfirmasiReq')
    .post(validateKonfirmasiReq, trxKonfirmasiReqController);

router.route('/riwayat')
    .get(authToken, trxRiwayatController);

router.route('/riwayatUser')
    .get(validateRiwayatUser, trxRiwayatUserController);


router.route('/kosonginSaldo')
    .post(validateKosonginSaldo, kosonginSaldoRoleController);

router.route('/tambahinSaldo')
    .post(validateTambahinSaldoRole, tambahinSaldoRoleController);

router.route('/exporTransaksi')
    .post(authToken, postExporTransaksiController);

export default router;