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


    /**
     * USER GET OPERATIONS *
     */


    async getUnauthenticated(): Promise<any> {
        const db = this.getFirestore();
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.get());
    }

    async getOthersDocument(): Promise<any> {
        const db = this.getFirestore(this.theirAuth);
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.get());
    }

    async listUsersCollection(): Promise<any> {
        const db = this.getFirestore(this.myAuth);
        await firebase.assertFails(db.collection('users').get());
    }

    async listUsersCollectionUnauthenticated(): Promise<any> {
        const db = this.getFirestore();
        await firebase.assertFails(db.collection('users').get());
    }


    /**
     * USER UPDATE OPERATIONS *
     */



    async updateUnauthenticated(): Promise<any> {
        const admin = this.getAdminFirestore();
        await admin.collection('users').doc(this.myId).set({ foo: 'bar' });

        const db = this.getFirestore();
        const testDoc = db.collection('users').doc(this.myId);
        await firebase.assertFails(testDoc.update({ foo: 'not bar' }));
    }
}