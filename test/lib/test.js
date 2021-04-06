"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const firebase = require("@firebase/rules-unit-testing");
const MY_PROJECT_ID = 'kwelismart';
/**
 * MY AUTH
*/
const myId = 'user_abc';
const myEmail = 'userabc@email.com';
const myAuth = { uid: myId, email: myEmail };
/**
 * THEIR AUTH
*/
// const theirId = 'user_xyz';
// const theirEmail = 'userxyz@email.com';
// const theirAuth = { uid: theirId, email: theirEmail };
const getFirestore = (auth) => {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
};
// const getAdminFirestore = () => {
//     return firebase.initializeTestApp({ projectId: MY_PROJECT_ID }).firestore();
// };
beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
describe('KweliSmart', () => {
    it('Can perform basic arithmetic', () => {
        assert.strictEqual(1 + 1, 2);
    });
    it('Can\'t delete a users document', async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.delete());
    });
});
//# sourceMappingURL=test.js.map