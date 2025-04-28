import * as admin from 'firebase-admin';

admin.initializeApp();

export {rules} from './auth/rules';
export {registrationsApproved} from './notifications/registrationsApproved';
export {indicated} from './notifications/indicated';