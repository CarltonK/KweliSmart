import * as firebase from '@firebase/rules-unit-testing';

export default class UserDocumentHandler {
    private projectId: string;
    /**
     * MY AUTH
     */
    private myId = 'user_abc';
    private myEmail = 'userabc@email.com';
    private myAuth = { uid: this.myId, email: this.myEmail };

    /**
     * THEIR AUTH
     */
    private theirId = 'user_xyz';
    private theirEmail = 'userxyz@email.com';
    private theirAuth = { uid: this.theirId, email: this.theirEmail };

    constructor() {
        this.projectId = '<PROJECT_ID>';
    }

    private getFirestore = (auth?: Record<string, unknown>) => {
        return firebase.initializeTestApp({ projectId: this.projectId, auth: auth }).firestore();
    };

    private getAdminFirestore = () => {
        return firebase.initializeAdminApp({ projectId: this.projectId }).firestore();
    };

    async beforeEachCallback() {
        await firebase.clearFirestoreData({ projectId: this.projectId });
    }

    async afterAllCallback() {
        await firebase.clearFirestoreData({ projectId: this.projectId });
        await Promise.all(firebase.apps().map(app => app.delete()));
    }


    /**
     * USER GET OPERATIONS *
     */

    async denyGetUnauthenticated() {
        const db = this.getFirestore();
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.get());
    }

    async denyGetOthers() {
        const db = this.getFirestore(this.theirAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.get());
    }

    async denyListUsers() {
        const db = this.getFirestore(this.myAuth);
        await firebase.assertFails(db.collection('users').get());
    }

    async denyListUsersUnauthenticated() {
        const db = this.getFirestore();
        await firebase.assertFails(db.collection('users').get());
    }

    async allowGetOwn() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertSucceeds(testDoc.get());
    }


    /**
     * USER CREATE OPERATIONS *
     */

    async denyCreateUnauthenticated() {
        const db = this.getFirestore();
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ foo: 'bar' }));
    }

    async denyCreateOthers() {
        const db = this.getFirestore(this.theirAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ foo: 'bar' }));
    }

    async denyCreateNoRequiredFields() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ foo: 'bar' }));
    }

    async denyCreateNatIdLess() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ nationalIdNumber: '123456' }));
    }

    async denyCreateNatIdMore() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ nationalIdNumber: '123456789' }));
    }

    async denyCreateNatIdNotString() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ nationalIdNumber: 123456789 }));
    }

    async denyCreatePhoneNotString() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ phoneNumber: 1234567890 }));
    }

    async denyCreatePhoneNot10Digits() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ phoneNumber: '123456789' }));
    }

    async denyCreatePhoneIncorrectStartDigits() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ phoneNumber: '123456789' }));
    }

    async denyCreateMissingRequiredField() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.set({ nationalIdNumber: '12345678', emailAddress: this.myEmail }));
    }

    async allowCreateOwn() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertSucceeds(testDoc.set({ phoneNumber: '0712345678', nationalIdNumber: '12345678', emailAddress: this.myEmail }));
    }


    /**
     * USER UPDATE OPERATIONS *
     */

    async denyUpdateUnauthenticated() {
        const admin = this.getAdminFirestore();
        await admin.collection('users').doc(this.myId).set({ foo: 'bar' });

        const db = this.getFirestore();
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.update({ foo: 'not bar' }));
    }

    async denyUpdateOthers() {
        const admin = this.getAdminFirestore();
        await admin.collection('users').doc(this.myId).set({ foo: 'bar' });

        const db = this.getFirestore(this.theirAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.update({ foo: 'not bar' }));
    }

    async denySomeFieldsUpdate() {
        const admin = this.getAdminFirestore();
        await admin.collection('users').doc(this.myId).set({ foo: 'bar', phoneNumber: '0712345678' });

        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.update({ foo: 'not bar', phoneNumber: '0787654321' }));
    }

    async denyUpdateOwn() {
        const admin = this.getAdminFirestore();
        await admin.collection('users').doc(this.myId).set({ foo: 'bar' });

        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertSucceeds(testDoc.update({ foo: 'not bar' }));
    }


    /**
     * USER DELETE OPERATIONS *
     */


     async denyDeleteUnauthenticated() {
        const db = this.getFirestore();
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.delete());
    }

    async denyDeleteOthers() {
        const db = this.getFirestore(this.theirAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.delete());
    }

    async denyDeleteOwn() {
        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.delete());
    }
}