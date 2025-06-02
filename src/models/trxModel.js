import moment from 'moment';
import XLSX from "xlsx-js-style";

import { 
    hash
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
import { ROLE_ID } from '../enums/roleID.js';
import { 
  addCell, 
  XLSXSTYLE
} from '../util/xslxStyle.js';
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import fs from 'fs';

export const logTransfer = async (connection, Nominal, userAsal, userTujuan, idReq) => {
    let q1 = '';
    q1 += 'SELECT B.Nominal, A.TokenAndroid ';
    q1 += 'FROM user A ';
    q1 += 'LEFT JOIN saldo B ON A.UserName = B.UserName ';
    q1 += 'WHERE A.UserName = ? ';
    q1 += 'FOR UPDATE';
    
    const param1 = [
        userAsal,
    ];
//Ada handle muncul duit jadi saldoAwalUserAsal kasih 0 kalo ga dapet;
    const drUserAsal = parseReturnMySQL(await connection.query(q1, param1))[0] ?? {};
    const saldoAwalUserAsal = drUserAsal.Nominal ?? 0;
    const saldoAkhirUserAsal = (parseFloat(saldoAwalUserAsal) - parseFloat(Nominal)).toFixed(4);
    let q2 = '';
    q2 += 'SELECT B.Nominal, A.TokenAndroid ';
    q2 += 'FROM user A ';
    q2 += 'LEFT JOIN saldo B ON A.UserName = B.UserName ';
    q2 += 'WHERE A.UserName = ? ';
    q2 += 'FOR UPDATE';
    
    const param2 = [
        userTujuan,
    ];

    const drUserTujuan = parseReturnMySQL(await connection.query(q2, param2))[0];
    const saldoAwalUserTujuan = drUserTujuan.Nominal;
    const saldoAkhirUserTujuan = (parseFloat(saldoAwalUserTujuan) + parseFloat(Nominal)).toFixed(4);

    let q3 = '';
    q3 += 'INSERT transaksi ';
    q3 += '(UserAsal, SaldoAkhirUserAsal, JumlahTransaksi, UserTujuan, SaldoAkhirUserTujuan, IdReq, created_at) ';
    q3 += 'VALUES ';
    q3 += '(?, ?, ?, ?, ?, ?, NOW());';

    const param3 = [
        userAsal,
        saldoAkhirUserAsal,
        Nominal,
        userTujuan,
        saldoAkhirUserTujuan,
        idReq
    ]

    const idTransaksi = parseReturnMySQL(await connection.query(q3, param3)).insertId;

    let q4 = '';
    q4 += 'UPDATE saldo ';
    q4 += 'SET Nominal = ?, lastIdTransaksi = ? ';
    q4 += 'WHERE UserName = ?;';

    const param4 = [
        saldoAkhirUserAsal,
        idTransaksi,
        userAsal
    ]

    await connection.query(q4, param4);
    
    let q5 = '';
    q5 += 'UPDATE saldo ';
    q5 += 'SET Nominal = ?, lastIdTransaksi = ? ';
    q5 += 'WHERE UserName = ?;';

    const param5 = [
        saldoAkhirUserTujuan,
        idTransaksi,
        userTujuan
    ]
    await connection.query(q5, param5);

    let q6 = '';
    q6 += vbcrlf + 'SELECT * FROM ( '
    q6 += vbcrlf + 'SELECT A.UserAsal, Asal.Name NamaUserAsal, A.UserTujuan, Tujuan.Name NamaUserTujuan, A.JumlahTransaksi, FORMAT(A.JumlahTransaksi, 2) Nominal, A.created_at, DATE_FORMAT(A.created_at, \'%Y-%m-%d %H:%i:%s\') WaktuTransaksi, CAST(A.idReq AS CHAR) idReq, ';
    q6 += 'CASE ';
    q6 +=  'WHEN A.idReq = -1 THEN \'TopUp\'';
    q6 +=  'WHEN A.idReq = -2 THEN \'Withdraw\'';
    q6 +=  'WHEN A.idReq = -3 THEN \'TopUp Pribadi\'';
    q6 +=  'WHEN A.idReq = -4 THEN \'Pembayaran\'';
	q6 +=  'ELSE \'Transfer\'';
    q6 += 'END TipeTransaksi, \'1\' no';
    q6 += vbcrlf + 'FROM transaksi A ';
    q6 += vbcrlf + 'LEFT JOIN user Asal ON A.UserAsal = Asal.UserName ';
    q6 += vbcrlf + 'LEFT JOIN saldo AsalSaldo ON A.UserAsal = AsalSaldo.UserName ';
    q6 += vbcrlf + 'LEFT JOIN user Tujuan ON A.UserTujuan = Tujuan.UserName ';
    q6 += vbcrlf + 'LEFT JOIN saldo TujuanSaldo ON A.UserAsal = TujuanSaldo.UserName ';
    q6 += vbcrlf + 'WHERE A.idTransaksi = ? ';
    q6 += vbcrlf + ') a ';
    q6 += vbcrlf + 'WHERE 1=1 ';

    const param6 = [
        idTransaksi
    ]

    const data = parseReturnMySQL(await connection.query(q6, param6))[0];
    
    if (drUserAsal != {}) {
        if (drUserAsal.TokenAndroid != null) {
            const bodyNotifUserAsal = {
                token: drUserAsal.TokenAndroid,
                notification: {
                    title: 'Pengurangan saldo',
                    body: 'Saldo anda telah berkurang sebanyak Rp.' + data.Nominal
                },
                data: data
            }
            await sendFCM(bodyNotifUserAsal);
        }
    }
    if (drUserTujuan.TokenAndroid != null) {
        const bodyNotifUserTujuan = {
            token: drUserTujuan.TokenAndroid,
            notification: {
                title: 'Penambahan saldo',
                body: 'Saldo anda telah bertambah sebanyak Rp.' + data.Nominal
            },
            data: data
        }
        
        await sendFCM(bodyNotifUserTujuan);
    }

    return idTransaksi;
}

export const logReqTransaksi = async (connection, body, user) => {
    
    let q = '';
    q += 'INSERT reqtransaksi ';
    q += '(H_Timestamp, UserTujuan, Nominal, idTransaksi, created_at) ';
    q += 'VALUES ';
    q += '(?, ?, ?, NULL, NOW());';
    
    const timestamp = moment().valueOf();
    const h_timestamp = hash(timestamp.toString());

    const param = [
        h_timestamp,
        user.UserName,
        body.Nominal
    ];

    await connection.query(q, param);
    return h_timestamp;
}
export const getReqStatus = async (connection, body) => {
    
    let q = '';
    q += 'SELECT * ';
    q += 'FROM reqtransaksi ';
    q += 'WHERE H_Timestamp = ? AND idTransaksi IS NOT NULL;';

    const param = [
        body.h_timestamp
    ];

    const resp = parseReturnMySQL(await connection.query(q, param));
    if (resp == 0) {
        return 'Transaksi belum selesai!!!';
    } else {
        return 'Transaksi sukses!!!';
    }
}
export const konfirmasiReqTransaksi = async (connection, body, user) => {
    const pin_hash = hash(body.PIN + user.UserName.toLowerCase());
    console.log(user.UserName);
    
    let q1 = '';
    q1 += 'SELECT * ';
    q1 += 'FROM user ';
    q1 += 'WHERE UserName = ? AND PIN = ?;';

    const param1 = [
        user.UserName,
        pin_hash
    ];

    parseReturnMySQL(await connection.query(q1, param1), 
        'Transaksi tidak ditemukan!!!')[0];

    let q2 = '';
    q2 += 'SELECT idReq, Nominal, UserTujuan ';
    q2 += 'FROM reqtransaksi ';
    q2 += 'WHERE H_Timestamp = ? AND idTransaksi IS NULL;';

    const param2 = [
        body.h_timestamp
    ];

    const reqtransaksi = parseReturnMySQL(await connection.query(q2, param2), 
        'Transaksi tidak ditemukan!!!')[0];

    await saldoMencukupi(connection, user.UserName, reqTransaksi.Nominal);
    
    const idTransaksi = await logTransfer(connection, reqTransaksi.Nominal, user.UserName, reqTransaksi.UserTujuan, reqTransaksi.idReq);
    
    let q4 = '';
    q4 += 'UPDATE reqtransaksi ';
    q4 += 'SET idTransaksi = ? ';
    q4 += 'WHERE H_Timestamp = ? AND idTransaksi IS NULL;';
    
    const param4 = [
        idTransaksi,
        body.h_timestamp
    ];
    
    await connection.query(q4, param4);
}

export const saldoMencukupi = async (connection, UserName, Nominal) => {
    
    let q = '';
    q += 'SELECT Nominal ';
    q += 'FROM saldo ';
    q += 'WHERE UserName = ? AND Nominal >= ?;';
    
    const param = [
        UserName,
        Nominal
    ];
    
    parseReturnMySQL(await connection.query(q, param), 
        'Saldo anda tidak mencukupi!!!');
}


export const getTransaksi = async (connection, query, RoleID, UserName) => {
    
    let s = ''
    let sSelect = '';
    sSelect += vbcrlf + 'SELECT * FROM ( '
    sSelect += vbcrlf + 'SELECT A.UserAsal, Asal.Name NamaUserAsal, A.UserTujuan, Tujuan.Name NamaUserTujuan, A.JumlahTransaksi, FORMAT(A.JumlahTransaksi, 2) Nominal, A.created_at, DATE_FORMAT(A.created_at, \'%Y-%m-%d %H:%i:%s\') WaktuTransaksi, A.idReq, ';
    sSelect += 'CASE ';
    sSelect +=  'WHEN A.idReq = -1 THEN \'TopUp\'';
    sSelect +=  'WHEN A.idReq = -2 THEN \'Withdraw\'';
    sSelect +=  'WHEN A.idReq = -3 THEN \'TopUp Pribadi\'';
    sSelect +=  'WHEN A.idReq = -4 THEN \'Pembayaran\'';
	sSelect +=  'ELSE \'Transfer\'';
    sSelect += 'END TipeTransaksi';
    sSelect += vbcrlf + 'FROM transaksi A ';
    sSelect += vbcrlf + 'LEFT JOIN user Asal ON A.UserAsal = Asal.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN saldo AsalSaldo ON A.UserAsal = AsalSaldo.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN user Tujuan ON A.UserTujuan = Tujuan.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN saldo TujuanSaldo ON A.UserAsal = TujuanSaldo.UserName ';
    sSelect += vbcrlf + ') a ';
    sSelect += vbcrlf + 'WHERE 1=1 ';
    s += sSelect;
    const param = [];

    let sFilter = ''
    sFilter += setupFilter(query.filter,
      'AND (UserAsal LIKE @f OR UserNameAsal LIKE @f OR UserTujuan LIKE @f OR UserNameTujuan LIKE @f OR JumlahTransaksi LIKE @f) ');
    
    const tipeTrx = query.tipeTrx;
    if (tipeTrx != undefined) {
        sFilter += 'AND TipeTransaksi = ?';
        param.push(tipeTrx);
    }

    const userSearch = query.userSearch;
    if (userSearch == undefined) {
        if (RoleID != ROLE_ID.Admin) {
            sFilter += 'AND (UserAsal = ? OR UserTujuan = ?) ';
            param.push(UserName);
            param.push(UserName);
        }
    } else {
        sFilter += 'AND (UserAsal = ? OR UserTujuan = ?) ';
        param.push(userSearch);
        param.push(userSearch);
    }

    if (query.TanggalAwal != undefined) {        
        sFilter += 'AND ? <= created_at ';
        param.push(query.TanggalAwal);
    }
    
    if (query.TanggalAkhir != undefined) {
        sFilter += 'AND created_at <= ?';
        param.push(query.TanggalAkhir);
    }
    s += sFilter;

    let sSort = 'ORDER BY '
    if (query.sortCol != undefined && query.sortCol != '' &&
      query.sortDir != undefined && query.sortDir != '') {
      sSort += query.sortCol + ' ' + query.sortDir + ' '
    } else {
      sSort += 'created_at DESC '
    }
    s += sSort

    s += vbcrlf + setupOffset(query.start, query.limit);
    
    const data = tambahRowNo(
        parseReturnMySQL(await connection.query(s, param)),
        parseFloat(query.start)
    );

    s = 'SELECT COUNT(1) rc FROM (' + sSelect + sFilter + ') a;'

    const rowCount = parseReturnMySQL(await connection.query(s, param))[0]['rc'];
    
    s = 'SELECT FORMAT(SUM(JumlahTransaksi), 2) Nominal FROM (' + sSelect + sFilter + ') a;'

    const totalNominal = parseReturnMySQL(await connection.query(s, param))[0]['Nominal'];

    return {
        data: data,
        rowCount: rowCount,
        totalNominal: totalNominal
    }
}

export const getTransaksiUser = async (connection, query, UserName) => {
    
    let s = ''
    let sSelect = '';
    const param = [];

    sSelect += vbcrlf + 'SELECT * FROM ( '
    sSelect += vbcrlf + 'SELECT A.user, Asal.Name NamaUserAsal, FORMAT(A.SaldoAkhirUser, 2) SaldoAkhirUser, A.UserLawan, Tujuan.Name NamaUserLawan, FORMAT(A.JumlahTransaksi, 2) Nominal, A.created_at, DATE_FORMAT(A.created_at, \'%Y-%m-%d %H:%i:%s\') WaktuTransaksi, A.idReq, A.TipeTrx, ';
    sSelect += 'CASE ';
    sSelect +=  'WHEN A.TipeTrx = -1 THEN \'Uang Masuk\'';
    sSelect +=  'WHEN A.TipeTrx = -2 THEN \'Uang Keluar\'';
	sSelect +=  'ELSE \'--\'';
    sSelect += 'END TipeTransaksi';
    sSelect += vbcrlf + 'FROM ( ';
    sSelect += 'SELECT A1.UserTujuan user, A1.SaldoAkhirUserTujuan SaldoAkhirUser, A1.UserAsal UserLawan, A1.JumlahTransaksi, A1.created_at, A1.idReq, -1 TipeTrx ';
    sSelect += 'FROM transaksi A1 ';
    sSelect += 'UNION ';
    sSelect += 'SELECT A2.UserAsal user, A2.SaldoAkhirUserAsal SaldoAkhirUser, A2.UserTujuan UserLawan, A2.JumlahTransaksi, A2.created_at, A2.idReq, -2 TipeTrx ';
    sSelect += 'FROM transaksi A2 ';
    sSelect += ') A ';
    sSelect += vbcrlf + 'LEFT JOIN user Asal ON A.user = Asal.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN saldo AsalSaldo ON A.user = AsalSaldo.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN user Tujuan ON A.UserLawan = Tujuan.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN saldo TujuanSaldo ON A.UserLawan = TujuanSaldo.UserName ';
    sSelect += vbcrlf + ') a ';
    sSelect += vbcrlf + 'WHERE 1=1 AND a.user = ? ';
    s += sSelect;
    param.push(UserName);

    let sFilter = ''
    sFilter += setupFilter(query.filter,
      'AND (User LIKE @f OR NamaUserAsal LIKE @f OR UserLawan LIKE @f OR NamaUserLawan LIKE @f OR JumlahTransaksi LIKE @f OR TipeTransaksi LIKE @f) ');
    
    if (query.TanggalAwal != null) {        
        sFilter += 'AND ? <= created_at ';
        param.push(body.TanggalAwal);
    }
    
    if (query.TanggalAkhir != null) {
        sFilter += 'AND created_at <= ?';
        param.push(body.TanggalAkhir);
    }
    s += sFilter;

    let sSort = 'ORDER BY '
    if (query.sortCol != undefined && query.sortCol != '' &&
      query.sortDir != undefined && query.sortDir != '') {
      sSort += query.sortCol + ' ' + query.sortDir + ' '
    } else {
      sSort += 'created_at DESC '
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
}


export const kosonginSaldoRole = async (connection, body, user) => {
    
    let q = '';
    q += 'CALL SP_KosonginSaldoRole(?, ?);';

    const param = [
        body.RoleID,
        user.UserName,
    ];

    return await connection.query(q, param);
}
export const tambahinSaldoRole = async (connection, body, user) => {
    
    let q = '';
    q += 'CALL SP_TambahinSaldoRole(?, ?, ?);';

    const param = [
        body.RoleID,
        user.UserName,
        body.Nominal,
    ];

    return await connection.query(q, param);
}


export const postExporTransaksi = async (connection, query) => {
    let s = ''
    let sSelect = '';
    sSelect += vbcrlf + 'SELECT * FROM ( '
    sSelect += vbcrlf + 'SELECT A.UserAsal, Asal.Name NamaUserAsal, A.UserTujuan, Tujuan.Name NamaUserTujuan, A.JumlahTransaksi, FORMAT(A.JumlahTransaksi, 2) Nominal, A.created_at, DATE_FORMAT(A.created_at, \'%Y-%m-%d %H:%i:%s\') WaktuTransaksi, A.idReq, ';
    sSelect += 'CASE ';
    sSelect +=  'WHEN A.idReq = -1 THEN \'TopUp\'';
    sSelect +=  'WHEN A.idReq = -2 THEN \'Withdraw\'';
    sSelect +=  'WHEN A.idReq = -3 THEN \'TopUp Pribadi\'';
    sSelect +=  'ELSE \'Transfer\'';
    sSelect += 'END TipeTransaksi';
    sSelect += vbcrlf + 'FROM transaksi A ';
    sSelect += vbcrlf + 'LEFT JOIN user Asal ON A.UserAsal = Asal.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN saldo AsalSaldo ON A.UserAsal = AsalSaldo.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN user Tujuan ON A.UserTujuan = Tujuan.UserName ';
    sSelect += vbcrlf + 'LEFT JOIN saldo TujuanSaldo ON A.UserAsal = TujuanSaldo.UserName ';
    sSelect += vbcrlf + ') a ';
    sSelect += vbcrlf + 'WHERE 1=1 ';
    s += sSelect;
    const param = [];

    let sFilter = ''
    
    sFilter += setupFilter(query.filter,
    'AND (UserAsal LIKE @f OR NamaUserAsal LIKE @f OR UserTujuan LIKE @f OR NamaUserTujuan LIKE @f OR JumlahTransaksi LIKE @f) ');
    
    const tipeTrx = query.tipeTrx;
    if (tipeTrx != undefined) {
        sFilter += 'AND TipeTransaksi = ?';
        param.push(tipeTrx);
    }

    if (query.TanggalAwal != undefined) {        
        sFilter += 'AND ? <= created_at ';
        param.push(query.TanggalAwal);
    }
    
    if (query.TanggalAkhir != undefined) {
        sFilter += 'AND created_at <= ?';
        param.push(query.TanggalAkhir);
    }
    
    if (query.user != undefined) {
        sFilter += 'AND (UserAsal = ? OR UserTujuan = ?)';
        param.push(query.user);
        param.push(query.user);
    }
    s += sFilter;

    let sSort = 'ORDER BY '
    if (query.sortCol != undefined && query.sortCol != '' &&
    query.sortDir != undefined && query.sortDir != '') {
        sSort += query.sortCol + ' ' + query.sortDir + ' '
    } else {
        sSort += 'created_at DESC '
    }
    s += sSort

    // s += vbcrlf + setupOffset(query.start, query.limit);
    
    const data = tambahRowNo(
        parseReturnMySQL(await connection.query(s, param)),
        parseFloat(query.start)
    );

    s = 'SELECT FORMAT(SUM(JumlahTransaksi), 2) Nominal FROM (' + sSelect + sFilter + ') a;'

    const totalNominal = parseReturnMySQL(await connection.query(s, param))[0]['Nominal'];
  
    return export_to_excel(data, totalNominal, tipeTrx, query.user);
}
  
function export_to_excel(dt0, totalNominal, tipeTrx, user) {
    const wb = XLSX.utils.book_new();

    var ws_data = [];

    let row = [];
    if (user) {
        row = addCell(row, XLSXSTYLE.BoldS10, 'Transaksi User [' + user + ']');
        ws_data.push(row); row = []; // 1
    } else {
        row = addCell(row, XLSXSTYLE.BoldS10, 'Transaksi Bulanan');
        ws_data.push(row); row = []; // 1
    } 
    if (tipeTrx) {
        row = addCell(row, XLSXSTYLE.BoldS10Center, 'Tipe Transaksi: ' + tipeTrx);
        ws_data.push(row); row = []; // 2
    } else {
        row = addCell(row, XLSXSTYLE.BoldS10Center, 'Tipe Transaksi: Semua');
        ws_data.push(row); row = []; // 2
    }
    row = addCell(row, XLSXSTYLE.BoldS10Center, 'Total : Rp.' + totalNominal);
    ws_data.push(row); row = []; // 3

    ws_data.push(row); row = []; // 4

    row = addCell(row, XLSXSTYLE.BoldS9CenterBorderHair, 'NO');
    row = addCell(row, XLSXSTYLE.BoldS9CenterBorderHair, 'User Asal');
    row = addCell(row, XLSXSTYLE.BoldS9CenterBorderHair, 'Nominal');
    row = addCell(row, XLSXSTYLE.BoldS9CenterBorderHair, 'User Tujuan');
    row = addCell(row, XLSXSTYLE.BoldS9CenterBorderHair, 'Waktu Transaksi');
    ws_data.push(row); row = []; // 5

    let lastDt0Index = 0;
    dt0.forEach((el, index) => {
      row = addCell(row, XLSXSTYLE.S9BorderHair, index + 1);
      row = addCell(row, XLSXSTYLE.S9BorderHair, el.UserAsal);
      row = addCell(row, XLSXSTYLE.S9BottomRightBorderHair, el.JumlahTransaksi, "n", '#,##0');
      row = addCell(row, XLSXSTYLE.S9BorderHair, el.UserTujuan);
      row = addCell(row, XLSXSTYLE.S9BorderHair, el.WaktuTransaksi);
      ws_data.push(row); row = []; // 6...
      lastDt0Index = index;
    });
    
    var ws = XLSX.utils.aoa_to_sheet(ws_data);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 }},
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 }},
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 }}
    ]
    
    ws["!cols"] = [
      { wch: 4 },
      { wch: 15 },
      { wch: 14 },
      { wch: 15 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Transaksi Bulanan');

    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

async function sendFCM(body) {
    try {
        const auth = new GoogleAuth({
        keyFile: 'serviceAccount.json',
        scopes: ['https://www.googleapis.com/auth/firebase.messaging']
        })
    
        const client = await auth.getClient()
        const accessToken = await client.getAccessToken()
    
        const fcmUrl = 'https://fcm.googleapis.com/v1/projects/asamba-6282d/messages:send'
        const message = {
        message: body
        }

        await axios.post(fcmUrl, message, {
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json'
          }
        });
    } catch (error) {
        fs.appendFileSync('fcm_error.log', `[${new Date().toISOString()}] ${error.stack || error}\n`);
    }
}