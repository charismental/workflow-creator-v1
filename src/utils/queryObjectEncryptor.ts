import CryptoJS from 'crypto-js';
import LZString from 'lz-string';
import { Nullable, WorkflowRole } from 'types';

const secret = process.env.REACT_APP_QUERY_SECRET || 'secret';

export const queryObjectEncryptor = (stateObject: any): string => {
    if (!stateObject || typeof stateObject !== 'object') return '';
    const compressedStringifiedState = LZString.compressToEncodedURIComponent(JSON.stringify(stateObject));
    const encrypted = CryptoJS.AES.encrypt(compressedStringifiedState, secret).toString();

    return encrypted
};

export const queryObjectDecryptor = (encryptedObjectStr: string): Nullable<WorkflowRole> => {
    if (!encryptedObjectStr || typeof encryptedObjectStr !== 'string') return null;
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedObjectStr), secret);
    const decryptedCompressedObjectStr = bytes.toString(CryptoJS.enc.Utf8);

    try {
        const parsedObject = JSON.parse(LZString.decompressFromEncodedURIComponent(decryptedCompressedObjectStr));

        return parsedObject
    } catch (e) {
        console.log('queryObjectDecryptor error', e);
        return null;
    }
};