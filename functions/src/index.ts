import * as functions from 'firebase-functions';
import { Logger } from '@firebase/logger';
import * as admin from 'firebase-admin';

admin.initializeApp();

import HttpHandler from './handler/http/HttpHandler';
import UserDocumentHandler from './handler/firestore/UserDocumentHandler';
import StatementDocumentHandler from './handler/firestore/StatementDocumentHandler';

const logger = new Logger('Root');
logger.setLogLevel('debug');

// Define functions
const runOptions: functions.RuntimeOptions = {
  timeoutSeconds: 60,
  memory: '512MB',
  ingressSettings: "ALLOW_ALL",
};
const regionalFunctions = functions.runWith(runOptions).region('europe-west3');


const GlobalHttpHandler = new HttpHandler();
const GlobalUserDocumentHandler = new UserDocumentHandler();
const GlobalStatementDocumentHandler = new StatementDocumentHandler();

/******************
* Http Trigger(s)
******************/

export const api = regionalFunctions.https.onRequest(GlobalHttpHandler.handleRequest.bind(GlobalHttpHandler));

/******************
* Firestore Trigger(s)
******************/

export const newUserDocument = regionalFunctions.firestore.document('users/{user}').onCreate(
  GlobalUserDocumentHandler.newUserDocumentHandler.bind(GlobalUserDocumentHandler)
);

export const newStatementDocument = regionalFunctions.firestore.document('statements/{statement}').onCreate(
  GlobalStatementDocumentHandler.newStatementHandler.bind(GlobalStatementDocumentHandler)
);
