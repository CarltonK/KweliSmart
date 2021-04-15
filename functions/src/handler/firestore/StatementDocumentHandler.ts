import { Logger } from '@firebase/logger';
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import NotificationHelper from '../../helper/NotificationHelper';

export default class StatementDocumentHandler {

    private logger: Logger = new Logger('StatementDocumentHandler');
    private db = firestore();
    private notificationHelper: NotificationHelper = new NotificationHelper();

    constructor() {
        this.logger.setLogLevel('debug');
    }

    async newStatementHandler(snapshot: firestore.QueryDocumentSnapshot, context: functions.EventContext) {
        try {
            // Identifiers
            const docId: string = snapshot.id;
            const { userId } = snapshot.data();
            const statementStatus: boolean | string = 'uploaded';
            const statementReference: firestore.DocumentReference = this.db.collection('statements').doc(docId);

            // Get User
            const userDocRef: firestore.DocumentReference = this.db.collection('users').doc(userId);
            const userDoc = await userDocRef.get();

            if (userDoc.exists) {
                // Send a notification
                const deviceToken = userDoc.get('deviceToken');
                if (deviceToken) {
                    await this.notificationHelper.singleNotificationSend(
                        deviceToken,
                        'Statement uploaded',
                        'We\'re working on it and we will get back to you ASAP'
                    );
                }

                await userDocRef.update({
                    statementStatus,
                    statementReference,
                })
            }

        } catch (error) {
            this.logger.error('newStatementDocumentHandler: ', error);
        }
        return;
    }
}