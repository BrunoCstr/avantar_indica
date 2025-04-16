import * as admin from 'firebase-admin';

admin.initializeApp();

export {registrationsApproved} from './notifications/registrationsApproved';
export {indicated} from './notifications/indicated';
