import UserDocumentHandler from './handler/users-user';
import StatementDocumentHandler from './handler/statements-statement';

const GlobalUserDocumentHandler = new UserDocumentHandler();
const GlobalStatementDocumentHandler = new StatementDocumentHandler();

beforeEach(GlobalUserDocumentHandler.beforeEachCallback.bind(GlobalUserDocumentHandler));
beforeEach(GlobalStatementDocumentHandler.beforeEachCallback.bind(GlobalStatementDocumentHandler));

describe('KweliSmart', () => {

    /**
     * USER GET OPERATIONS *
     */

    it(
        'Can\'t allow an unauthenticated user to get a users document',
        GlobalUserDocumentHandler.denyGetUnauthenticated.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to get another users document',
        GlobalUserDocumentHandler.denyGetOthers.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow an unauthenticated user to get all documents in the users collection',
        GlobalUserDocumentHandler.denyListUsersUnauthenticated.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to get all documents in the users collection',
        GlobalUserDocumentHandler.denyListUsers.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can allow a user to get their document',
        GlobalUserDocumentHandler.allowGetOwn.bind(GlobalUserDocumentHandler),
    );


    /**
     * USER CREATE OPERATIONS *
     */

    it(
        'Can\'t allow an unauthenticated user to create their document',
        GlobalUserDocumentHandler.denyCreateUnauthenticated.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to create another users document',
        GlobalUserDocumentHandler.denyCreateOthers.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to create their document if required fields are missing',
        GlobalUserDocumentHandler.denyCreateNoRequiredFields.bind(GlobalUserDocumentHandler),  
    );

    it(
        'Can\'t allow a user to create their document if nationalId is less than 7 digits',
        GlobalUserDocumentHandler.denyCreateNatIdLess.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to create their document if nationalId is greater than 8 digits',
        GlobalUserDocumentHandler.denyCreateNatIdMore.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to create their document if nationalId is not a string',
        GlobalUserDocumentHandler.denyCreateNatIdNotString.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to create their document if phoneNumber is not a string',
        GlobalUserDocumentHandler.denyCreatePhoneNotString.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to create their document if phoneNumber is not 10 digits',
        GlobalUserDocumentHandler.denyCreatePhoneNot10Digits.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to create their document if phoneNumber does not start with 07 or 01',
        GlobalUserDocumentHandler.denyCreatePhoneIncorrectStartDigits.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can allow a user to create their document if a required field is missing',
        GlobalUserDocumentHandler.denyCreateMissingRequiredField.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can allow a user to create their document if it is valid',
        GlobalUserDocumentHandler.allowCreateOwn.bind(GlobalUserDocumentHandler),
    );


    /**
     * USER UPDATE OPERATIONS *
     */

    it(
        'Can\'t allow an unauthenticated user to update a document',
        GlobalUserDocumentHandler.denyUpdateUnauthenticated.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to update another users document',
        GlobalUserDocumentHandler.denyUpdateOthers.bind(GlobalUserDocumentHandler),  
    );

    it(
        'Can\'t allow a user to update some fields in their document',
        GlobalUserDocumentHandler.denySomeFieldsUpdate.bind(GlobalUserDocumentHandler), 
    );

    it(
        'Can allow a user to update their document',
        GlobalUserDocumentHandler.denyUpdateOwn.bind(GlobalUserDocumentHandler),
    );


    /**
     * USER DELETE OPERATIONS *
     */

    it(
        'Can\'t allow an unauthenticated user to delete their document',
        GlobalUserDocumentHandler.denyDeleteUnauthenticated.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to delete another users document',
        GlobalUserDocumentHandler.denyDeleteOthers.bind(GlobalUserDocumentHandler),
    );

    it(
        'Can\'t allow a user to delete their document',
        GlobalUserDocumentHandler.denyDeleteOwn.bind(GlobalUserDocumentHandler),
    );



    /**
     * STATEMENT CREATE OPERATIONS *
     */

    it(
        'Can\'t allow an unauthenticated user to create a statement',
        GlobalStatementDocumentHandler.denyCreateUnauthenticated.bind(GlobalStatementDocumentHandler),
    );

    it(
        'Can\'t allow a non existent user to create a statement',
        GlobalStatementDocumentHandler.denyCreateIfUserNonExistent.bind(GlobalStatementDocumentHandler),
    );

    it(
        'Can allow a user to create a statement if valid',
        GlobalStatementDocumentHandler.allowCreateIfStatementValid.bind(GlobalStatementDocumentHandler),
    );


    /**
     * STATEMENT GET OPERATIONS *
     */

    it(
        'Can\'t allow an unauthenticated user to get a statement',
        GlobalStatementDocumentHandler.denyGetUnauthenticated.bind(GlobalStatementDocumentHandler),
    );

    it(
        'Can\'t allow a non existent user to get a statement',
        GlobalStatementDocumentHandler.denyGetIfUserNonExistent.bind(GlobalStatementDocumentHandler),
    );

    it(
        'Can allow an existing user to get their statement',
        GlobalStatementDocumentHandler.allowGetIfValid.bind(GlobalStatementDocumentHandler),
    );

});

after(GlobalUserDocumentHandler.afterAllCallback.bind(GlobalUserDocumentHandler));
after(GlobalStatementDocumentHandler.afterAllCallback.bind(GlobalStatementDocumentHandler));