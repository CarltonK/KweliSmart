import * as functions from 'firebase-functions';
import { Logger } from '@firebase/logger';
import * as admin from 'firebase-admin';

admin.initializeApp();

import HttpHandler from './handler/HttpHandler';
import DocumentHandler from './handler/DocumentHandler';

const logger = new Logger('Root');
logger.setLogLevel('debug');

// Define functions region
const regionalFunctions = functions.runWith({
  timeoutSeconds: 60,
  memory: '512MB',
}).region('europe-west3');


const GlobalHttpHandler = new HttpHandler();
const GlobalDocumentHandler = new DocumentHandler();

/******************
* Http Trigger
******************/

export const api = regionalFunctions.https.onRequest(GlobalHttpHandler.handleRequest.bind(GlobalHttpHandler));

/******************
* Firestore Trigger
******************/

export const newUserDocument = regionalFunctions.firestore.document('users/{user}').onCreate(GlobalDocumentHandler.newUserDocumentHandler.bind(GlobalDocumentHandler));
