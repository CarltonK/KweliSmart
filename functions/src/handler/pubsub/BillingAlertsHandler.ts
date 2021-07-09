import { Logger } from '@firebase/logger';
import * as functions from 'firebase-functions';

export default class BillingAlertsHandler {

    private logger: Logger = new Logger('BillingAlertsHandler');

    constructor() {
        this.logger.setLogLevel('debug');
    }

    async billingHandler(message: functions.pubsub.Message) {
        try {
            const data = message.json;
            return this.handleBillingData(data);
        } catch (error) {
            this.logger.error(error);
        }
        return null;
    }

    async handleBillingData(data: any) {
        return null;
    }
}