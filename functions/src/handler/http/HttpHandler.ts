import { Logger } from '@firebase/logger';
import * as functions from 'firebase-functions';

export default class HttpHandler {

    private logger: Logger = new Logger('HttpHandler');

    constructor() {
        this.logger.setLogLevel('debug');
    }

    async handleRequest(request: functions.https.Request, response: functions.Response<any>): Promise<void> {
        this.logger.log(request.path, request.method);
        const { method } = request;

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
}