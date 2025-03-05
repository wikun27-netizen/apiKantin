import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

import { 
    parseReturnMySQL
} from '../util/Helper.js';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const handleFinishedConnection = async (connection, commit) => {
    if (connection) {
        if (commit) 
            await connection.commit();
        else
        await connection.rollback();
    await connection.release();
}
}

export const vbcrlf = '\n'

export const cekRoleID = async (connection, user, RoleID) => {
    let q = '';
    q += 'SELECT * ';
    q += 'FROM User ';
    q += 'WHERE UserName = ? AND RoleID = ?;';
    const param = [
        user.UserName,
        RoleID
    ];
    
    const resp = await connection.query(q, param);
    parseReturnMySQL(resp, 'Role anda tidak memiliki akses untuk menu ini!!!');
}

export const setupFilter = (filter, txtFilter) => {
    if (filter != '') return txtFilter.replace(/@f/g, '\'%' + filter + '%\'');
    return '';
}
export const setupOffset = (start, limit) => {
    return 'LIMIT ' + limit + ' OFFSET ' + (start - 1).toString();
}
export const tambahRowNo = (obj, initNum) => {
  let num = initNum;
  if (!Array.isArray(obj)) {
    return
  }
  obj.forEach(el => {
    el['no'] = num;
    num += 1;
  });
  return obj
}