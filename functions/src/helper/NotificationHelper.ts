import { Logger } from '@firebase/logger';
import { messaging } from 'firebase-admin';

export default class NotificationHelper {
    private logger: Logger = new Logger('NotificationHelper');
    private fcm = messaging();

    constructor() {
        this.logger.setLogLevel('debug');
    }

    async singleNotificationSend(token: string, title: string, body: string): Promise<void> {
        try {
            if (token !== null) {
                const payload = {
                    notification: {
                        title,
                        body,
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                }
                await this.fcm.sendToDevice(token, payload);
            }
        } catch (error) {
            this.logger.error('singleNotificationSendERROR: ',error);
        }
        return;
    }
}