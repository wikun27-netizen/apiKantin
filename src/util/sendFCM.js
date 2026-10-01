import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import https from 'https';
import { appendFile } from 'fs/promises';

const FCM_URL = 'https://fcm.googleapis.com/v1/projects/asamba-6282d/messages:send';

// Dibuat SEKALI saat modul dimuat. Access token di-cache oleh library
// dan diperbarui otomatis menjelang kedaluwarsa.
const auth = new GoogleAuth({
    keyFile: 'serviceAccount.json',
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
});

// keep-alive: koneksi TLS ke FCM dipakai ulang, tidak handshake tiap kirim
const http = axios.create({
    timeout: 5000,
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 })
});

const logError = (msg) =>
    appendFile('fcm_error.log', `[${new Date().toISOString()}] ${msg}\n`).catch(() => {});

const getAccessToken = async () => {
    const client = await auth.getClient();            // di-cache oleh GoogleAuth
    const { token } = await client.getAccessToken();  // di-cache sampai mendekati expired
    return token;
};

// Panggil sekali saat server start supaya request pertama tidak kena cold start
export const warmUpFCM = async () => {
    try {
        await getAccessToken();
    } catch (error) {
        await logError(`warmUp: ${error.stack || error}`);
    }
};

// return: true = terkirim, false = gagal (sudah di-log)
export const sendFCM = async (body, retry = 1) => {
    try {
        const token = await getAccessToken();
        await http.post(FCM_URL, { message: body }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return true;
    } catch (error) {
        const status = error.response?.status;

        // retry sekali untuk error sementara (5xx, 429, atau gagal koneksi)
        if (retry > 0 && (!status || status >= 500 || status === 429)) {
            await new Promise(r => setTimeout(r, 300));
            return sendFCM(body, retry - 1);
        }

        await logError(
            `status=${status ?? '-'} ` +
            JSON.stringify(error.response?.data ?? (error.stack || String(error)))
        );
        return false;
    }
};