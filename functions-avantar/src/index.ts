import * as admin from 'firebase-admin';

admin.initializeApp();

export {rules} from './auth/rules';
export {setUserClaims} from './auth/setUserClaims';
export {registrationsApproved} from './notifications/registrationsApproved';
export {indicated} from './notifications/indicated';
export {createUserAsAdmin} from './auth/createUserAsAdmin';
export {updateUserPassword} from './auth/updateUserPassword';
export {indicatedInBulk} from './notifications/indicateInBulk';
export {withdrawRequest} from './notifications/withdrawRequest';
export {closedProposal} from './notifications/closedProposal';
export {withdrawalStatus} from './notifications/withdrawalStatus';
export {onUserUpdate} from './others/usernameSynchronization';
export {onUnitUpdate} from './others/unitnameSynchronization';
export {onProfilePictureUpdate} from './others/profilePictureSynchronization';
export {moveToArchived} from './others/moveToArchived';
export * from './auth/updateUserEmail';
export * from './auth/toggleUserActive';
