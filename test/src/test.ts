import * as firebase from '@firebase/rules-unit-testing';

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
const theirId = 'user_xyz';
const theirEmail = 'userxyz@email.com';
const theirAuth = { uid: theirId, email: theirEmail };

const getFirestore = (auth?: Record<string, unknown>) => {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
};

const getAdminFirestore = () => {
    return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
};

beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

describe('KweliSmart', () => {

    /**
     * USER GET OPERATIONS *
    */

    it('Can\'t allow an unauthenticated user to get a users document', async () => {
        const db = getFirestore();
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.get());
    });

    it('Can\'t allow a user to get another users document', async () => {
        const db = getFirestore(theirAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.get());
    });

    it('Can\'t allow an unauthenticated user to get all documents in the users collection', async () => {
        const db = getFirestore();
        await firebase.assertFails(db.collection('users').get());
    });

    it('Can\'t allow a user to get all documents in the users collection', async () => {
        const db = getFirestore(myAuth);
        await firebase.assertFails(db.collection('users').get());
    });

    it('Can\'t allow an unauthenticated user to get their document', async () => {
        const db = getFirestore();
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.get());
    });

    it('Can allow a user to get their document', async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertSucceeds(testDoc.get());
    });


    /**
     * USER CREATE OPERATIONS *
    */

    it('Can\'t allow an unauthenticated user to create their document', async () => {
        const db = getFirestore();
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.set({ foo: 'bar' }));
    });

    it('Can\'t allow a user to create another users document', async () => {
        const db = getFirestore(theirAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.set({ foo: 'bar' }));
    });

    it('Can allow a user to create their document', async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertSucceeds(testDoc.set({ foo: 'bar' }));
    });


    /**
     * USER UPDATE OPERATIONS *
    */


    it('Can\'t allow an unauthenticated user to update a document', async () => {
        const admin = getAdminFirestore();
        await admin.collection('users').doc(myId).set({ foo: 'bar' });

        const db = getFirestore();
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.update({ foo: 'not bar' }));
    });

    it('Can\'t allow a user to update another users document', async () => {
        const admin = getAdminFirestore();
        await admin.collection('users').doc(myId).set({ foo: 'bar' });

        const db = getFirestore(theirAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.update({ foo: 'not bar' }));
    });

    it('Can allow a user to update their document', async () => {
        const admin = getAdminFirestore();
        await admin.collection('users').doc(myId).set({ foo: 'bar' });

        const db = getFirestore(myAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertSucceeds(testDoc.update({ foo: 'not bar' }));
    });


    /**
     * USER DELETE OPERATIONS *
    */


    it('Can\'t allow an unauthenticated user to delete their document', async () => {
        const db = getFirestore();
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.delete());
    });

    it('Can\'t allow a user to delete another users document', async () => {
        const db = getFirestore(theirAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.delete());
    });

    it('Can\'t allow a user to delete their document', async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.delete());
    });
});

after(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
    await Promise.all(firebase.apps().map(app => app.delete()));
});