import CryptoJS from 'crypto-js';
import { Nullable, WorkflowRole } from 'types';

const secret = process.env.REACT_APP_QUERY_SECRET || 'secret';

export const queryObjectEncryptor = (stateObject: any): string => {
    if (!stateObject || typeof stateObject !== 'object') return '';
    const stringifiedState = JSON.stringify(stateObject);

    return CryptoJS.AES.encrypt(stringifiedState, secret).toString();
};

export const queryObjectDecryptor = (encryptedObjectStr: string): Nullable<WorkflowRole> => {
    if (!encryptedObjectStr || typeof encryptedObjectStr !== 'string') return null;
    const bytes = CryptoJS.AES.decrypt(encryptedObjectStr, secret);
    const decryptedObjectStr = bytes.toString(CryptoJS.enc.Utf8);

    try {
        const parsedObject = JSON.parse(decryptedObjectStr);

        return parsedObject
    } catch (e) {
        console.log('queryObjectDecryptor error', e);
        return null;
    }
};