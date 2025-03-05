import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const SEED = process.env.HASH_SEED;

export const hash = (text) => {
    return crypto.createHmac('sha256', SEED).update(text).digest('hex');
}
export const generateRandomText = (length) => {
    return crypto.randomBytes(length).toString("base64").slice(0, length);
}