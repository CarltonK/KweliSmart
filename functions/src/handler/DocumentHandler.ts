import { Logger } from '@firebase/logger';
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

export default class DocumentHandler {

    private logger: Logger = new Logger('DocumentHandler');
    private db = firestore();

    constructor() {
        this.logger.setLogLevel('debug')
    }

    async newUserDocumentHandler(snapshot: firestore.QueryDocumentSnapshot, context: functions.EventContext) {

        try {
            // Identifiers
            const uid: string = snapshot.id;
            const userDocRef: firestore.DocumentReference = this.db.collection('users').doc(uid);
            const createdAt: firestore.Timestamp = firestore.Timestamp.now();

            // this.logger.info(`The user identified by ${uid} was created at ${createdAt.toDate()}`);
            await userDocRef.update({ createdAt: createdAt });
        } catch (error) {
            this.logger.error('newUserDocumentHandler: ', error);
        }
        return;
    }
}