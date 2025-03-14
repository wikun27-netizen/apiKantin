import dotenv from 'dotenv';

import { 
    pool,
    handleFinishedConnection,
    cekRoleID
} from '../util/db.js';

import {
    APIResponse,
	throwErr
} from '../util/defaultResponse.js';
import { ROLE_ID } from '../enums/roleID.js';

import {
    getUser,
    cekSalahPIN,
    hashData,
    getUserSaldo,
    getUserByIdhash
} from '../models/userModel.js';
import {
    logTransfer,
    logReqTransaksi,
    getReqStatus,
    konfirmasiReqTransaksi,
    saldoMencukupi,

    getTransaksi,
    getTransaksiUser,
    
    kosonginSaldoRole,
    tambahinSaldoRole,
    postExporTransaksi
} from '../models/trxModel.js';
import { TIPETRX } from '../enums/tipeTrx.js';

dotenv.config();

export const trxSetSaldoPribadiController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const reqBody = req.body;
        
        await cekRoleID(connection, req.user, ROLE_ID.Admin);

        await logTransfer(connection, reqBody.valDiff, '0', req.user.UserName, TIPETRX.MunculDuit);

        const respSaldo = await getUserSaldo(connection, req.user);
        resp = respSaldo[0];

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'TopUp berhasil!!!', {
        'Saldo': resp.NominalNum
    }));
};
export const trxTopUpController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const reqBody = req.body;
        
        await cekRoleID(connection, req.user, ROLE_ID.Admin);

        await logTransfer(connection, reqBody.Nominal, req.user.UserName, reqBody.User, TIPETRX.Topup);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, 'TopUp berhasil!!!'));
};
export const trxWithdrawController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const reqBody = req.body;
        
        await cekRoleID(connection, req.user, ROLE_ID.Admin);

        await logTransfer(connection, reqBody.Nominal, reqBody.User, req.user.UserName, TIPETRX.Withdraw);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, 'TopUp berhasil!!!'));
};

export const trxReqController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLE_ID.Penjual);

        const h_timestamp = await logReqTransaksi(connection, reqBody, req.user);
        resp = {
            'h_timestamp': h_timestamp
        };

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, resp));
};

export const trxReqStatusController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLE_ID.Penjual);

        resp = await getReqStatus(connection, reqBody);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, resp, null));
};

export const trxKonfirmasiReqController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLE_ID.Pembeli);

        const respUser = await getUser(connection, req.user.UserName);
        const user = respUser[0];

        const msg = await cekSalahPIN(connection, user, hashData(reqBody.PIN, user.UserName));
        if (msg != null) {
            commit = true;
            throw new Error(msg);
        }
        
        await konfirmasiReqTransaksi(connection, reqBody, user);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Pembayaran berhasil!!!', null));
};


export const trxReqPembayaranController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLE_ID.Pembeli);

        const respUserTujuan = await getUserByIdhash(connection, reqBody.idHash);
        resp = respUserTujuan[0];

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, resp));
};

export const trxKonfirmasiReqPembayaranController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLE_ID.Pembeli);

        const respUser = await getUser(connection, req.user.UserName);
        const user = respUser[0];

        const msg = await cekSalahPIN(connection, user, hashData(reqBody.PIN, user.UserName));
        if (msg != null) {
            commit = true;
            throw new Error(msg);
        }

        await saldoMencukupi(connection, user.UserName, reqBody.Nominal);

        const respUserTujuan = await getUserByIdhash(connection, reqBody.idHash);
        const userTujuan = respUserTujuan[0];
        
        await logTransfer(connection, reqBody.Nominal, user.UserName, userTujuan.UserName, -4);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Pembayaran berhasil!!!', null));
};


export const trxRiwayatController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const UserName = req.user.UserName;

        const respUser = await getUser(connection, req.user.UserName);
        const user = respUser[0];

        let RoleID = user.RoleID;

        resp = await getTransaksi(connection, req.query, RoleID, UserName);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, resp));
}
export const trxRiwayatUserController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const reqQuery = req.query;
        const UserName = reqQuery.UserName

        resp = await getTransaksiUser(connection, reqQuery, UserName);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, resp));
}


export const kosonginSaldoRoleController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLE_ID.Admin);

        await kosonginSaldoRole(connection, reqBody, req.user);

        const respSaldo = await getUserSaldo(connection, req.user);
        resp = respSaldo[0];

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, {
        'Saldo': resp.NominalNum
    }));
};
export const tambahinSaldoRoleController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLE_ID.Admin);

        await tambahinSaldoRole(connection, reqBody, req.user);

        const respSaldo = await getUserSaldo(connection, req.user);
        resp = respSaldo[0];

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, {
        'Saldo': resp.NominalNum
    }));
};

export const postExporTransaksiController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const buffer = await postExporTransaksi(connection, req.body);
        
        res.setHeader('Content-Disposition', 'attachment; filename="ExporTransaksi.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        const base64Data = buffer.toString('base64');

        commit = true;
        res.send(APIResponse(true, null, base64Data));
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
};