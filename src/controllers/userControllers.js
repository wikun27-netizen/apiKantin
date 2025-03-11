import jwt, { decode } from 'jsonwebtoken'
import moment from 'moment';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const PHOTO_PATH = process.env.PHOTO_PATH;

import { 
    pool,
    handleFinishedConnection,
    cekRoleID
} from '../util/db.js';

import {
    APIResponse,
	throwErr
} from '../util/defaultResponse.js';
import { generateToken } from '../middleware/tokenHandler.js';
import { ROLEID } from '../enums/roleID.js';

import {
    getUserAll,
    getUserAllList,
    getUserOutside,

    getUser,
    logSuccessLogin,
    logCurrentTokenSign,
    cekTokenValid,

    cekUserSudahAda,
    createUser,
    changePassword,
    resetPassword,
    nonaktifkanUser,
    
    getUserSaldo,

    cekPINSudahAda,
    logPIN,


    cekSalahPassword,
    cekSalahPIN,
    hashData,
    postUserTokenAndroid,
} from '../models/userModel.js';

export const tes = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    res.send(APIResponse(true, null, resp));
};
// All User
export const userAllController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        resp = await getUserAll(connection);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, resp));
};

// All UserList
export const userAllListController = async (req, res) => {
    let connection;
        let resp = '';
        let commit = false;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            await cekRoleID(connection, req.user, ROLEID.Admin);
            
            resp = await getUserAllList(connection, req.query);
    
            commit = true;
        } catch (err) {
            res.send(throwErr(err));
            return;
        } finally {
            handleFinishedConnection(connection, commit);
        }
        res.send(APIResponse(true, null, resp));
};

// UserDetail
export const userDetailController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        resp = await getUserOutside(connection, req.query.UserName);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, resp));
};

// Login User
export const userLoginController = async (req, res) => {
    let connection;
    let resp = '';
    let user;
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;
        
        const respUser = await getUser(connection, reqBody.UserName);
        user = respUser[0];

        const msg = await cekSalahPassword(connection, user, hashData(reqBody.Password, reqBody.UserName))
        if (msg != null) {
            commit = true;
            throw new Error(msg);
        }
        
        resp = generateToken(user);
        await logSuccessLogin(connection, user, resp);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Login Berhasil!!!', {
        'Name': user.Name,
        'UserName': user.UserName,
        'RoleID': user.RoleID,
        'Saldo': user.NominalNum,
        ...resp
    }));
};
// Update TokenAndroid User
export const userTokenAndroidController = async (req, res) => {
    let connection;
    let resp = '';
    let user;
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;
        
        await postUserTokenAndroid(connection, reqBody.TokenAndroid, req.user.UserName);
        
        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Update Token Berhasil!!!', null));
};
// User Has setup PIN
export const userHasPINController = async (req, res) => {
    let connection;
    let user;
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const respUser = await getUser(connection, req.user.UserName);
        user = respUser[0];
        
        if (user.PIN == null) {
            throw new Error('User belum setup PIN!!!');
        }
        
        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'User sudah setup PIN!!!', null));
};
// Refresh Token
export const userRefreshToken = async (req, res) => {
	const reqBody = req.body;
    const refreshToken = reqBody.refreshToken;

    let connection;
    let resp = '';
    let commit = false;
	try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
    
        const user = await new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedUser) => {
                if (err) {
                    return reject(new Error('Invalid refresh token relog!!!'));
                }
    
                const expired = decode(refreshToken).exp * 1000;
                const momen = moment().valueOf();
    
                if (expired < momen) {
                    return reject(new Error('RefreshToken dah expired relog!!!'));
                }
    
                resolve(decodedUser);
            });
        });
    
        const oldAccessToken = req.headers['authorization'];
        await cekTokenValid(connection, oldAccessToken, user.UserName);
    
        resp = generateToken(user);
        await logCurrentTokenSign(connection, user.UserName, resp.accessToken);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, resp));
};
// UserNameHash
export const userNameHashController = async (req, res) => {
    let connection;
    let resp = '';
    let user;
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const respUser = await getUser(connection, req.user.UserName);
        user = respUser[0];

        resp = {
            userNamehash: user.idHash
        };

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, null, 
        resp
    ));
};
// User Photo
export const userPhotoController = async (req, res) => {
    let resp;
    try {
        const filePath = path.join(PHOTO_PATH, req.query.UserName + '.png');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // return res.status(404).json({ error: filePath + "...File not found" });
                return res.status(404).json({ error: "...File not found" });
            }
    
            const base64Image = Buffer.from(data).toString("base64");
            const mimeType = "image/jpeg";
    
            resp = { image: `data:${mimeType};base64,${base64Image}` };
            res.send(APIResponse(true, null, 
                resp
            ));
        });
    } catch (err) {
        res.send(throwErr(err));
        return;
    }
};


// Create User
export const userCreateController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        await cekRoleID(connection, req.user, ROLEID.Admin);

        const userSudahAda = await cekUserSudahAda(connection, reqBody.UserName);
        if (userSudahAda != 0) {
            throw new Error('UserName sudah ada silahkan pilih UserName lain!!!');
        }

        await createUser(connection, reqBody, req.user);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Create User Berhasil!!!', null));
};
// Change Photo
export const userChangePhotoController = async (req, res) => {
    try {
        const Photo = req.body.Photo;

        if (!Photo) {
            return res.status(400).json({ error: "Foto tidak ada" });
        }

        const matches = Photo.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ error: "Format tidak valid" });
        }

        const base64Data = matches[2];
        const filePath = path.join(PHOTO_PATH, req.user.UserName + '.png');
        fs.writeFile(filePath, base64Data, { encoding: "base64" }, (err) => {
            if (err) {
                return res.status(500).json({ error: "Gagal simpan foto" });
            }
            res.send(APIResponse(true, 'Ubah Photo Berhasil!!!', null));
        });

    } catch (err) {
        res.send(throwErr(err));
        return;
    }
};
// Change Password
export const userChangePasswordController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        const respUser = await getUser(connection, req.user.UserName);
        const user = respUser[0];

        const msg = await cekSalahPassword(connection, user, hashData(reqBody.OldPassword, user.UserName))
        if (msg != null) {
            commit = true;
            throw new Error(msg);
        }
        
        await changePassword(connection, reqBody, req.user);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Change Password Berhasil!!!', null));
};
// Reset Password
export const userResetPasswordController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;
        
        await cekRoleID(connection, req.user, ROLEID.Admin);

        await getUser(connection, reqBody.UserName);

        resp = await resetPassword(connection, reqBody, req.user);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Reset Password Berhasil!!!', {
        'newPassword': resp
    }));
};

// Reset Password
export const nonaktifkanUserController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;
        
        await cekRoleID(connection, req.user, ROLEID.Admin);

        resp = await nonaktifkanUser(connection, reqBody);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Nonaktifkan user berhasil!!!', null));
};


// Saldo User
export const userSaldoController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
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

// Bikin PIN
export const userCreatePINController = async (req, res) => {
    let connection;
    let resp = '';
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        const PINSudahAda = await cekPINSudahAda(connection, req.user);
        if (PINSudahAda != 0) {
            throw new Error('PIN sudah ada!!!');
        }

        resp = await logPIN(connection, reqBody.PIN, req.user);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Create PIN berhasil!!!', null));
};
// Ganti PIN
export const userChangePINController = async (req, res) => {
    let connection;
    let resp = '';
    let user;
    let commit = false;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const reqBody = req.body;

        const respUser = await getUser(connection, req.user.UserName);
        const user = respUser[0];

        const msg = await cekSalahPIN(connection, user, hashData(reqBody.OldPIN, user.UserName));
        if (msg != null) {
            commit = true;
            throw new Error(msg);
        }

        await logPIN(connection, reqBody.NewPIN, user);

        commit = true;
    } catch (err) {
        res.send(throwErr(err));
        return;
    } finally {
        handleFinishedConnection(connection, commit);
    }
    res.send(APIResponse(true, 'Change PIN berhasil!!!', null));
};

