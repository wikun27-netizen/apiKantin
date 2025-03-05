import dotenv from 'dotenv';
import moment from 'moment';

import { 
    hash,
    generateRandomText
} from "../util/crypto.js";
import {
    parseReturnMySQL
} from '../util/Helper.js';
import {
    vbcrlf,
    setupFilter,
    setupOffset,
    tambahRowNo,
} from '../util/db.js';

dotenv.config();

export const getUserAll = async (connection) => {
    let q = '';
    q += 'SELECT A.Name, A.UserName, A.RoleID, B.Nominal ';
    q += 'FROM User A ';
    q += 'LEFT JOIN Saldo B ON A.UserName = B.UserName;'
    
    const responseGetUserAll = await connection.execute(q);
    
    return parseReturnMySQL(responseGetUserAll, 'User tidak ditemukkan!!!');
};

export const getUserAllList = async (connection, query) => {

    let s = ''
    let sSelect = '';
    sSelect += vbcrlf + 'SELECT * FROM ( '
    sSelect += vbcrlf + 'SELECT A.Name NamaUser, A.UserName, FORMAT(B.Nominal, 2) Nominal, C.created_at last_transaction, DATE_FORMAT(C.created_at, \'%Y-%m-%d %H:%i:%s\') TransaksiTerakhir, c.IdTransaksi last_transaction_id, A.IsAktif, ';
    sSelect += 'CASE ';
    sSelect +=  'WHEN A.RoleID = 1 THEN \'Penjual\'';
    sSelect +=  'WHEN A.RoleID = 2 THEN \'Pembeli\'';
	sSelect +=  'ELSE \'Admin\'';
    sSelect += 'END RoleName';
    sSelect += vbcrlf + 'FROM user A ';
    sSelect += vbcrlf + 'LEFT JOIN saldo B ON A.username = B.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN LATERAL ( ';
    sSelect += vbcrlf + '  SELECT * ';
    sSelect += vbcrlf + '  FROM transaksi C ';
    sSelect += vbcrlf + '  WHERE C.UserAsal = A.UserName OR C.UserTujuan = A.UserName ';
    sSelect += vbcrlf + '  ORDER BY C.created_at DESC ';
    sSelect += vbcrlf + '  LIMIT 1) C ON 1=1 ';
    sSelect += vbcrlf + ') a ';
    sSelect += vbcrlf + 'WHERE 1=1 AND IsAktif = 1 ';
    s += sSelect;
    
    const param = [];
    
    let sFilter = ''
    sFilter += setupFilter(query.filter,
        'AND (NamaUser LIKE @f OR UserName LIKE @f OR Nominal LIKE @f OR TransaksiTerakhir LIKE @f OR RoleName LIKE @f) ');
        
    const tipeUser = query.tipeUser;
    if (tipeUser != undefined) {
        sFilter += 'AND RoleName = ? ';
        param.push(tipeUser);
    }
    s += sFilter;

    let sSort = 'ORDER BY '
    if (query.sortCol != undefined && query.sortCol != '' &&
        query.sortDir != undefined && query.sortDir != '') {
        sSort += query.sortCol + ' ' + query.sortDir + ' '
    } else {
        sSort += 'NamaUser ASC '
    }
    s += sSort
    s += vbcrlf + setupOffset(query.start, query.limit);
        
    const data = tambahRowNo(
        parseReturnMySQL(await connection.query(s, param)),
        parseFloat(query.start)
    );
    
    s = 'SELECT COUNT(1) rc FROM (' + sSelect + sFilter + ') a;'
    
    const rowCount = parseReturnMySQL(await connection.query(s, param))[0]['rc'];
        
    return {
        data: data,
        rowCount: rowCount
    }
};


export const getUser = async (connection, UserName) => {
    let q = '';
    q += 'SELECT *, FORMAT(B.Nominal, 2) NominalNum ';
    q += 'FROM User A ';
    q += 'LEFT JOIN Saldo B ON A.UserName = B.UserName ';
    q += 'WHERE A.UserName = ? AND IsAktif = 1;';
    const param = [
        UserName
    ];
    
    return parseReturnMySQL(await connection.execute(q, param), 'User tidak ditemukkan!!!');
};

export const getUserOutside = async (connection, UserName) => {
    let q = '';
    q += 'SELECT A.Name, A.UserName, FORMAT(B.Nominal, 2) NominalNum, IsAktif ';
    q += 'FROM User A ';
    q += 'LEFT JOIN Saldo B ON A.UserName = B.UserName ';
    q += 'WHERE A.UserName = ?;';
    const param = [
        UserName
    ];
    
    return parseReturnMySQL(await connection.execute(q, param), 'User tidak ditemukkan!!!');
};

export const logFailedLogin = async (connection, user, FAILED_LOGIN_LIMIT) => {
    let q = '';
    q += 'UPDATE User ';
    q += 'SET Failed_login = ? ';
    q += 'WHERE id = ?;';
    const param = [
        user.Failed_login, 
        user.id
    ];
    
    await connection.execute(q, param);
    if (user.Failed_login >= FAILED_LOGIN_LIMIT) {
        return 'Limit salah password sudah tercapai, silahkan hubungi Admin untuk reset password!!!';
    }
    return `Password anda salah!!! Kesempatan anda tinggal ${(FAILED_LOGIN_LIMIT - user.Failed_login)}x`;
};

export const logSuccessLogin = async (connection, user, resp) => {
    let q = '';
    q += 'UPDATE User ';
    q += 'SET Failed_login = 0, Last_Login = ? ';
    q += 'WHERE id = ?;';
    const param = [
        moment().format('YYYY-MM-DD HH:mm:ss'), 
        user.id
    ];
    
    await connection.execute(q, param);
    
    await logCurrentTokenSign(connection, user.UserName, resp.accessToken);
};

export const logCurrentTokenSign = async (connection, UserName, accessToken) => {
    const TokenSign = accessToken.split('.')[2];

    let q = '';
    q += 'UPDATE User ';
    q += 'SET TokenSign = ? ';
    q += 'WHERE UserName = ?;';
    const param = [
        TokenSign, 
        UserName
    ];
    
    await connection.execute(q, param);
};

export const cekTokenValid = async (connection, accessToken, UserName) => {
    const TokenSign = accessToken.split('.')[2];

    let q = '';
    q += 'SELECT * ';
    q += 'FROM User ';
    q += 'WHERE TokenSign = ? AND UserName = ?;';
    const param = [
        TokenSign, 
        UserName
    ];
    
    const resp = await connection.execute(q, param);
    return parseReturnMySQL(resp, 'Token anda tidak valid silahkan login ulang relog!!!');
};


export const cekUserSudahAda = async (connection, UserName) => {
    let q = '';
    q += 'SELECT * ';
    q += 'FROM User ';
    q += 'WHERE UserName = ?;';
    const param = [
        UserName
    ];
    
    const resp = await connection.query(q, param);
    return parseReturnMySQL(resp);
};

export const createUser = async (connection, body, user) => {
    const pass_hash = hash(body.Password + body.UserName.toLowerCase());
    
    let q1 = '';
    q1 += 'INSERT INTO User ';
    q1 += '(Name, UserName, Password, RoleID, UserInput, IsAktif, created_at, updated_at, Failed_login, TokenSign, last_login) ';
    q1 += 'VALUES ';
    q1 += '(?, ?, ?, ?, ?, 1, NOW(), NOW(), 0, \'\', NULL);';
    const param1 = [
        body.Name, 
        body.UserName, 
        pass_hash, 
        body.RoleID, 
        user.UserName
    ];
    
    await connection.query(q1, param1);
    
    let q2 = '';
    q2 += 'INSERT INTO Saldo ';
    q2 += '(UserName, Nominal, lastIdTransaksi) ';
    q2 += 'VALUES ';
    q2 += '(?, 0, 0);';
    const param2 = [
        body.UserName
    ];
    
    await connection.query(q2, param2);
};

export const changePassword = async (connection, body, user) => {
    const pass_hash = hash(body.NewPassword + user.UserName.toLowerCase());
    
    let q = '';
    q += 'UPDATE User ';
    q += 'SET Password = ? ';
    q += 'WHERE UserName = ?;';
    const param = [
        pass_hash, 
        user.UserName
    ];
    
    await connection.query(q, param);
};

export const resetPassword = async (connection, body, user) => {
    const pass_plain = generateRandomText(8);
    const pass_hash = hash(pass_plain + body.UserName.toLowerCase());
    
    let q = '';
    q += 'UPDATE User ';
    q += 'SET Password = ?, Failed_login = 0, Failed_PIN = 0, PIN = NULL ';
    q += 'WHERE UserName = ?;';
    const param = [
        pass_hash, 
        body.UserName
    ];
    
    await connection.query(q, param);
    return pass_plain;
};

export const nonaktifkanUser = async (connection, body) => {
    
    let q = '';
    q += 'UPDATE User ';
    q += 'SET IsAktif = 0, updated_at = NOW() ';
    q += 'WHERE UserName = ?;';
    const param = [
        body.UserName
    ];
    
    return await connection.query(q, param);
};


export const getUserSaldo = async (connection, user) => {
    let q = '';
    q += 'SELECT Format(Nominal, 2) NominalNum ';
    q += 'FROM Saldo ';
    q += 'WHERE UserName = ?;';
    const param = [
        user.UserName
    ];
    
    const responseGetUserSaldo = await connection.execute(q, param);
    return parseReturnMySQL(responseGetUserSaldo, 'User tidak ditemukkan!!!');
};


export const cekPINSudahAda = async (connection, user) => {
    let q = '';
    q += 'SELECT * ';
    q += 'FROM User ';
    q += 'WHERE UserName = ? AND PIN IS NOT NULL;';
    const param = [
        user.UserName
    ];
    
    const resp = await connection.execute(q, param);
    return parseReturnMySQL(resp);
};

export const logPIN = async (connection, PIN, user) => {
    const pin_hash = hash(PIN + user.UserName.toLowerCase());
    
    let q = '';
    q += 'UPDATE User ';
    q += 'SET PIN = ?, updated_at = NOW(), Failed_PIN = 0 ';
    q += 'WHERE UserName = ?';
    const param = [
        pin_hash, 
        user.UserName
    ];
    
    await connection.execute(q, param);
};

export const logFailedPIN = async (connection, user, FAILED_PIN_LIMIT) => {
    let q = '';
    q += 'UPDATE User ';
    q += 'SET Failed_PIN = ? ';
    q += 'WHERE id = ?';
    const param = [
        user.Failed_PIN, 
        user.id
    ];
    
    await connection.execute(q, param);
    if (user.Failed_PIN >= FAILED_PIN_LIMIT) {
        return 'Limit salah PIN sudah tercapai, silahkan lakukan reset password!!!';
    }
    return `PIN anda salah!!! Kesempatan anda tinggal ${(FAILED_PIN_LIMIT - user.Failed_PIN)}x`;
};



export const cekSalahPassword = async (connection, user, hashPass) => {
    const FAILED_LOGIN_LIMIT = process.env.FAILED_LOGIN_LIMIT;
    if (user.Failed_login >= FAILED_LOGIN_LIMIT) {
        throw new Error("Limit salah Password sudah tercapai, silahkan lakukan reset password!!!");
    }
    if (user.Password != hashPass) {
        user.Failed_login += 1;
        return await logFailedLogin(connection, user, FAILED_LOGIN_LIMIT);
    }
    return null;
}
export const cekSalahPIN = async (connection, user, hashPIN) => {
    const FAILED_PIN_LIMIT = process.env.FAILED_PIN_LIMIT;
    if (user.Failed_PIN >= FAILED_PIN_LIMIT) {
        throw new Error("Limit salah PIN sudah tercapai, silahkan lakukan reset password!!!");
    }
    if (user.PIN != hashPIN) {
        user.Failed_PIN += 1;
        return await logFailedPIN(connection, user, FAILED_PIN_LIMIT);
    }
    return null;
}
export const hashData = (dataPlain, UserName) => {
    return hash(dataPlain + UserName.toLowerCase());
}