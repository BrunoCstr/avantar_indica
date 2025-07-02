import * as admin from 'firebase-admin';

admin.initializeApp();

export {rules} from './auth/rules';
export {setUserClaims} from './auth/setUserClaims';
export {registrationsApproved} from './notifications/registrationsApproved';
export {indicated} from './notifications/indicated';
export {createUserAsAdmin} from './auth/createUserAsAdmin';
export {updateUserPassword} from './auth/updateUserPassword';
export * from './auth/updateUserEmail';
export * from './auth/toggleUserActive';