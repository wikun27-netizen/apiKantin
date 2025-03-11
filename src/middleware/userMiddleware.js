import { authToken } from '../middleware/tokenHandler.js';

import { isPanjangStr, isIn, hasSpace } from "../util/validator.js";

import { throwErr } from "../util/defaultResponse.js";

export const validateLogin = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('UserName', reqBody.UserName, 1, 255);
        isPanjangStr('Password', reqBody.Password, 1, 255);
        
        next()
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateTokenAndroid = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('TokenAndroid', reqBody.TokenAndroid, 1, 255);
        
        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateRefreshToken = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('refreshToken', reqBody.refreshToken, 1, 255);
        
        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validatePhotoUser = (req, res, next) => {
    try {
        const reqQuery = req.query;
        
        isPanjangStr('UserName', reqQuery.UserName, 1, 255);
        
        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateCreateUser = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('Name', reqBody.Name, 1, 255);
        isPanjangStr('UserName', reqBody.UserName, 1, 255);
        hasSpace('UserName', reqBody.UserName);
        
        isPanjangStr('Password', reqBody.Password, 1, 255);
        isIn('RoleID', reqBody.RoleID, ['0', '1', '2']);
        
        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateChangePassword = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('OldPassword', reqBody.OldPassword, 1, 255);
        isPanjangStr('NewPassword', reqBody.NewPassword, 1, 255);
        if (reqBody.OldPassword == reqBody.NewPassword) {
            throw new Error('Password lama tidak boleh sama dengan Password baru!!!');
        }

        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateResetPassword = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('UserName', reqBody.UserName, 1, 255);
        
        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateNonaktifkanUser = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('UserName', reqBody.UserName, 1, 255);
        
        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateCreatePIN = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('PIN', reqBody.PIN, 6, 6);
        
        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};

export const validateChangePIN = (req, res, next) => {
    try {
        const reqBody = req.body;
        
        isPanjangStr('OldPIN', reqBody.OldPIN, 6, 6);
        isPanjangStr('NewPIN', reqBody.NewPIN, 6, 6);
        
        if (reqBody.OldPIN == reqBody.NewPIN) {
            throw new Error('PIN lama tidak boleh sama dengan PIN baru!!!');
        }

        authToken(req, res, next); //next() nya di authToken();
    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};