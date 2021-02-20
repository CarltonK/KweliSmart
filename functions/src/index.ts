import * as functions from 'firebase-functions';
import { Logger } from '@firebase/logger';
import HttpHandler from './handler/HttpHandler';

const logger = new Logger('Root');
logger.setLogLevel('debug');

// Define functions region
const regionalFunctions = functions.runWith({
  timeoutSeconds: 60,
  memory: '512MB'
}).region('europe-west3');


const GlobalHttpHandler = new HttpHandler();

/******************
* Http Trigger
******************/

export const api = regionalFunctions.https.onRequest(GlobalHttpHandler.handleRequest.bind(GlobalHttpHandler));
