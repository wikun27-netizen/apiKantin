import { authToken } from './tokenHandler.js';

import { isPanjangStr, isMoney, isMoneyAja, isInValue, isIn } from "../util/validator.js";

import { throwErr } from "../util/defaultResponse.js";


export const validateSetSaldoPribadi = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isMoneyAja('valDiff', reqBody.valDiff);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateTopUp = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isMoney('Nominal', reqBody.Nominal);
        isPanjangStr('User', reqBody.User, 1, 255);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateWithdraw = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isMoney('Nominal', reqBody.Nominal);
        isPanjangStr('User', reqBody.User, 1, 255);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateReq = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isMoney('Nominal', reqBody.Nominal);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateReqStatus = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('Data', reqBody.h_timestamp, 1, 255);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateKonfirmasiReq = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('Data', reqBody.h_timestamp, 1, 255);
        isPanjangStr('PIN', reqBody.PIN, 6, 6);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateReqPembayaran = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('idHash', reqBody.idHash, 64, 255);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateKonfirmasiReqPembayaran = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('idHash', reqBody.idHash, 64, 255);
        isMoney('Nominal', reqBody.Nominal);
        isPanjangStr('PIN', reqBody.PIN, 6, 6);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateRiwayatUser = (req, res, next) => {
    try {
        const reqQuery = req.query;
        
        isPanjangStr('UserName', reqQuery.UserName, 1, 255);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateKosonginSaldo = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isIn('RoleID', reqBody.RoleID, ['0', '1', '2']);
        
        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateTambahinSaldoRole = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isIn('RoleID', reqBody.RoleID, ['0', '1', '2']);
        isMoney('Nominal', reqBody.Nominal);

        authToken(req, res, next);
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

