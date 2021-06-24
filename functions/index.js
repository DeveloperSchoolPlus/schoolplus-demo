// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// The Firebase Admin SDK to access Cloud Firestore.
'use strict';
const functions = require('firebase-functions');
const sanitizer = require('sanitizer');
const admin = require('firebase-admin');
var serviceAccount = require("./service-account-file.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://schoolplus-prod.firebaseio.com"
});

const firestore = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

/* // Take the text parameter passed to this HTTP endpoint and insert it into 
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've succesfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Cloud Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase();
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Cloud Firestore.
      // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    }); */

    exports.getSubCollections = functions.https.onRequest(async (req, res) => {

     

      const promises = [];
      const collections =  await firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc('TS_EVOL').listCollections();
      promises.push(collections);
      // const collectionIds = collections.map(col => col.id);

      collections.forEach(function(sub) {

        // const test = firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc('1EVOL').collection(sub.id).get();
        // if(test.empy) {
        //   console.log("No matching docs");
        //   res.status(200).send('No doc');
        // }

        // test.forEach(doc => {
        //   console.log(doc.data());
        // });

        // console.log('This is : ', sub.id);
        if(sub.id == 'SNT') 
        {
          functions.logger.log("OOOOOOOOK");
        }
        functions.logger.log("Look here : ", sub.id);

        functions.logger.log("About to start 2nd part");
        var docs = firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc('TS_EVOL').collection(sub.id).get();
        promises.push(docs);
        docs.then(function(querySnapshot) {
          querySnapshot.forEach(doc => {

            const writings = firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc('T_EVOL').collection(sub.id).doc(doc.id).set(doc.data());
            promises.push(writings);
            functions.logger.log(doc.id);
          });
        }).catch(function(err ){
          console.log(err);
        });
        


        // const docs = await firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc('1EVOL').collection(sub.id).get();
        // docs.forEach(doc => {
        //   functions.logger.log(doc.id);

        // })
      })


          
        
        
      
      Promise.all(promises)
      .then(results => {
        res.status(200).send('Copy done');
      }).catch(error => {
        res.statuts(500).send('error', error);
      });


    });


    exports.copyCollection = functions.https.onRequest(async (req,res) => {
//       functions.logger.log('The function has been called');

      const collectionName = req.query.collectionName;
      const promises = [];

      // await admin.firestore().collection(collectionName).doc('MESSAGE').set({mymessage: 'hello'});

      //Query
      const doc = await firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc('TS_EVOL').get();
      if(doc.empty) {
        console.log('no matching docs');
        res.status(200).send('dddd');
        return;
      }
      // snapshot.forEach(doc => {

        
          console.log(doc.id, '=>', doc.data());
          //Change collection name to set the destination
          
          const promise = admin.firestore().collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc('T_EVOL').set(doc.data());
          promises.push(promise);
        
        
      // })
      Promise.all(promises)
      .then(results => {
        res.status(200).send('Copy done');
      }).catch(error => {
        res.statuts(500).send('error');
      });
    });
  //   async function copyCollection(srcCollectionName, destCollectionName) {
      
  // }
  
  // copyCollection('messages', 'messages_2019').then(() => console.log('copy complete')).catch(error => console.log('copy failed. ' + error));

// [START allAdd]
// [START addFunctionTrigger]
// Adds two numbers to each other.
exports.addNumbers = functions.https.onCall((data) => {
  // [END addFunctionTrigger]
  // [START readAddData]
  // Numbers passed from the client.
  const firstNumber = 3;
  const secondNumber = 4;
  // [END readAddData]

  functions.logger.log('This is firstNumber: ', firstNumber);
  functions.logger.log('This is secondNumber: ', secondNumber);


  // console.log("This is firstNumber: ", firstNumber);
  // console.log("This is secondNumber: ", secondNumber);

  // [START addHttpsError]
  // Checking that attributes are present and are numbers.
  if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
      'two arguments "firstNumber" and "secondNumber" which must both be numbers.');
  }
  // [END addHttpsError]

  // [START returnAddData]
  // returning result.
  return {
    firstNumber: firstNumber,
    secondNumber: secondNumber,
    operator: '+',
    operationResult: firstNumber + secondNumber,
  };
  // [END returnAddData]
});
// [END allAdd]


// exports.sayHello = functions.https.onCall((data) => {
 
//   return {
//     message: 'Bonjour!'
//   };
// });


/* 
// [START messageFunctionTrigger]
// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.addMessage = functions.https.onCall((data, context) => {
  // [START_EXCLUDE]
  // [START readMessageData]
  // Message text passed from the client.
  const text = data.text;
  // [END readMessageData]
  // [START messageHttpsErrors]
  // Checking attribute.
  if (!(typeof text === 'string') || text.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
      'one arguments "text" containing the message text to add.');
  }
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }
  // [END messageHttpsErrors]

  // [START authIntegration]
  // Authentication / user information is automatically added to the request.
  const uid = context.auth.uid;
  const name = context.auth.token.name || null;
  const picture = context.auth.token.picture || null;
  const email = context.auth.token.email || null;
  // [END authIntegration]

  // [START returnMessageAsync]
  // Saving the new message to the Realtime Database.
  const sanitizedMessage = sanitizer.sanitizeText(text); // Sanitize the message.
  return admin.database().ref('/messages').push({
    text: sanitizedMessage,
    author: { uid, name, picture, email },
  }).then(() => {
    console.log('New Message written');
    // Returning the sanitized message to the client.
    return { text: sanitizedMessage };
  })
    // [END returnMessageAsync]
    .catch((error) => {
      // Re-throwing the error as an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('unknown', error.message, error);
    });
  // [END_EXCLUDE]
});
  // [END messageFunctionTrigger] */