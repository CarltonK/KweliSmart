import * as firebase from '@firebase/rules-unit-testing';

export default class StatementDocumentHandler {
    private projectId: string;

    /**
     * MY AUTH
     */
    private myId = 'user_abc';
    private myEmail = 'userabc@email.com';
    private myAuth = { uid: this.myId, emailAddress: this.myEmail };

    /**
     * THEIR AUTH
     */
    private theirId = 'user_xyz';
    private theirEmail = 'userxyz@email.com';
    private theirAuth = { uid: this.theirId, emailAddress: this.theirEmail };

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
     * STATEMENT CREATE OPERATIONS *
     */

    async denyCreateUnauthenticated() {
        const db = this.getFirestore();
        const testDoc = db.collection('statements').doc('statement');
        await firebase.assertFails(testDoc.set({ foo: 'bar' }));
    }

    async denyCreateIfUserNonExistent() {
        const admin = this.getAdminFirestore();
        await admin.collection('users').doc(this.theirId).set({ 
            nationalIdNumber: '12345678', 
            phoneNumber: '0712345678',
            ...this.theirAuth 
        });

        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('statements').doc('statement');
        await firebase.assertFails(testDoc.set({ foo: 'bar' }));
    }

    async allowCreateIfStatementValid() {
        const admin = this.getAdminFirestore();
        await admin.collection('users').doc(this.myId).set({ 
            nationalIdNumber: '12345678', 
            phoneNumber: '0712345678',
            ...this.myAuth 
        });

        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('statements').doc('statement');
        await firebase.assertSucceeds(testDoc.set({ userId: this.myId }));
    }


    /**
     * STATEMENT GET OPERATIONS *
     */

    async denyGetUnauthenticated() {
        const db = this.getFirestore();
        const testDoc = db.collection('statements').doc('statement');
        await firebase.assertFails(testDoc.get());
    }

    async denyGetIfUserNonExistent() {
        const admin = this.getAdminFirestore();
        // Create mock user
        await admin.collection('users').doc(this.theirId).set({ 
            nationalIdNumber: '12345678', 
            phoneNumber: '0712345678',
            ...this.theirAuth 
        });

        // Create Mock statement
        await admin.collection('statement').doc('statementOne').set({ 
            userId: this.myId, 
        });

        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('statements').doc('statementOne');
        await firebase.assertFails(testDoc.get());
    }

    async allowGetIfValid() {
        const admin = this.getAdminFirestore();
        // Create mock user
        await admin.collection('users').doc(this.myId).set({ 
            nationalIdNumber: '12345678', 
            phoneNumber: '0712345678',
            ...this.myAuth
        });

        // Create Mock statement
        await admin.collection('statements').doc('statementOne').set({ 
            userId: this.myId, 
        });

        const db = this.getFirestore(this.myAuth);
        const testDoc = db.collection('statements').doc('statementOne');
        await firebase.assertSucceeds(testDoc.get());
    }

}