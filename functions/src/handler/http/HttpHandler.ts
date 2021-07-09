import { Logger } from '@firebase/logger';
import * as functions from 'firebase-functions';
import BillingAlertsHandler from '../pubsub/BillingAlertsHandler';

export default class HttpHandler {

    private logger: Logger = new Logger('HttpHandler');
    private billingAlerts: BillingAlertsHandler;

    constructor() {
        this.logger.setLogLevel('debug');
        this.billingAlerts = new BillingAlertsHandler();
    }

    async handleRequest(request: functions.https.Request, response: functions.Response<any>): Promise<void> {
        this.logger.log(request.path, request.method);
        const { method, path } = request;

        if (method === 'POST' && path === '/localpubsub') { await this.localpubsub(request, response); return; }

        // return 405 METHOD NOT ALLOWED
        if (method !== 'POST') {
            response.status(405).send({
                status: false,
                detail: `${method.toUpperCase()} not allowed`,
            });
            return;
        };

        // return 404 NOT FOUND
        response.status(404).send({
            status: false,
            detail: 'The resource you requested is not available',
        });
        return;
    }

    private async localpubsub(request: functions.https.Request, response: functions.Response<any>) {
        const rawMessage = request.body as string;
        this.logger.log(`Raw data: ${rawMessage}`);
        try {
            const data = JSON.parse(rawMessage);
            if (data !== "undefined") {
                await this.billingAlerts.handleBillingData(data)
            } else {
                this.logger.error('Could not convert JSON')
            }
        } catch (error) {
            this.logger.error(`${error}`)
        }

        response.send({
            status: true,
            detail: 'Triggered local pubsub',
        });
        return;
    }
}