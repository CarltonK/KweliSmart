import { Logger } from '@firebase/logger';
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import slack = require('slack');

export default class BillingAlertsHandler {

    private logger: Logger = new Logger('BillingAlertsHandler');
    private db = firestore();

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
        // Grab the most recent data
        const billingInfoDoc = await this.db.doc('/private/billing_info').get();
        const { costAmount, costIntervalStart, budgetAmount} = data;
        const billingAlertIncrement = 0.01;
        let sendMessage = false;
        let messageString = '';

        // Compare to what we had before
        if (billingInfoDoc.exists) {
            const previousBillingInfo = billingInfoDoc.data();
            const lastCost = previousBillingInfo!.lastReportedCost;

            // If it's more than a certain amount send a slack message
            this.logger.log(`You have spent $${costAmount} compared to $${lastCost} last time out`);
            if (costAmount - lastCost > billingAlertIncrement) {
                sendMessage = true;
                messageString = `You have now spent $${costAmount} of your target budget of $${budgetAmount} since ${costIntervalStart}`;
            }

        }


        if (sendMessage) {
            const promises: Promise<any>[] = [
                this.db.doc('/private/billing_info').set({ lastReportedCost: costAmount }),
                slack.chat.postMessage({
                    token: process.env.SLACK_ACCESS_TOKEN,
                    channel: 'billing-alerts',
                    text: messageString,
                }),
            ];
            return Promise.all(promises);
        } else {
            return null;
        }
    }
}