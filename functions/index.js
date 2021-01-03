const functions = require('firebase-functions');
const FormData = require('form-data');
const fetch = require('node-fetch');
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.newBooking = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    let bookingInfo = req.body;
    console.log(req.body)
    admin.database().ref('Booking').orderByChild('userId').equalTo(`${bookingInfo.userID}`)
      .once('value', (snapshot) => {
        console.log(snapshot.val())
        if (snapshot.val()) {
          res.send(401, {
            "message": 'Booking exist already!'
          });
        }
        else {
          admin.database().ref('Booking').push({
            fullName: bookingInfo.fullName,
            userId: bookingInfo.userID,
            numberPlate: bookingInfo.numberPlate,
            bookingStartTime: bookingInfo.bookingStartTime,
            bookingEndTime: bookingInfo.bookingEndTime,
            bookingStatus: bookingInfo.bookingStatus,
            messagingToken: bookingInfo.messagingToken
          })
          console.log(bookingInfo.messagingToken)
          const message = {
            notification: {
              title: 'Booking Successful',
              body: 'You have successfully booked your parking!'
            },
            token: bookingInfo.messagingToken
          };

          admin.messaging().send(message)
            .then((response) => {
              // Response is a message ID string.
              console.log('Successfully sent message:', response);
              return response
            })
            .catch((error) => {
              console.log('Error sending message:', error);
            });
          res.status(200).send({
            "message": 'Booking successful'
          });
        }
      });
  }
});

// exports.bookingValidator = functions.database.ref('Booking/{pushId}')
//   .onCreate((snapshot, context) => {
//     let bookingInfo = snapshot.val();
//     var currentDateTime = moment().utcOffset("+05:30").format().slice(0, 16);
//     let bookingStartTime = snapshot.val().bookingStartTime;
//     console.log(bookingInfo.bookingParkingNumber)
//     // admin.database().ref('Parking Lot A').child('parkingStatus')
//     //   .child(`p${bookingInfo.bookingParkingNumber}`).set("Full");

//     let totalParkingLeft;
//     admin.database().ref('Parking Lot A').child('totalParkingLeft')
//       .on('value', snapshot => {
//         totalParkingLeft = snapshot.val();
//       });

//     return snapshot.ref.parent.child('totalParkingLeft').update(totalParkingLeft - 1);
//   });

// exports.bookingValidator = functions.database.ref('Booking/{pushId}')
//   .onDelete((snapshot) => {
//     let totalParkingLeft;
//     admin.database().ref('Parking Lot A').child('totalParkingLeft')
//       .on('value', snapshot => {
//         totalParkingLeft = snapshot.val();
//       });

//     return snapshot.ref.parent.child('totalParkingLeft').update(totalParkingLeft + 1);
//   })


//OVERTIME for BookingEndTime
exports.bookingOverTimeExpired = functions.database.ref('Booking/{pushId}/bookingStatus')
  .onUpdate((change, context) => {
    let token, userId, bookingInfo;
    const bookingStatusChange = change.after.val();
    let pushID = context.params.pushId;
    admin.database().ref('Booking').child(`${pushID}`)
      .on('value', snapshot => {
        bookingInfo = snapshot.val();
        userId = snapshot.val().userId;
        token = snapshot.val().messagingToken;
      });
    //sent expired message
    console.log(bookingStatusChange)

    if (bookingStatusChange === `expired_${userId}`) {
      const message = {
        notification: {
          title: 'Booking Ends',
          body: 'Your booking has expired! Please pay the remaining parking fees...'
        },
        token: token
      };

      admin.messaging().send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
          return response
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
      admin.database().ref('users').child(`${userId}`).child('previousBooking').push(bookingInfo);
      admin.database().ref('Booking').child(`${pushID}`).remove();
    } else if (bookingStatusChange === `overtimeHeadsUp_${userId}`) {    //sent overtimeHeadsUp message
      const message = {
        notification: {
          title: 'Heads Up, Booking expiring soon!',
          body: 'Your booking is expiring soon, so to avoid overcharge please extend your timing if available!',
        },
        token: token
      };

      admin.messaging().send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
          return response
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }

    return null;
  });

//Schedule function to track BOOKING START TIME
exports.scheduledFunctionbookingStartTime =
  functions.pubsub.schedule('every 1 minutes').onRun((context) => {

    let totalParkingLeft, bookingMinutes, token;
    admin.database().ref('Parking Lot A').child('totalParkingLeft')
      .on('value', snapshot => {
        totalParkingLeft = snapshot.val();
        console.log(totalParkingLeft)
      });

    admin.database().ref('Booking').orderByChild('bookingStartTime')
      .on('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          console.log(key)
          let bookingStartTime = snapshot.child(key).child('bookingStartTime').val();
          token = snapshot.child(key).child('messagingToken').val();
          let userId = snapshot.child(key).child('userId').val();
          console.log(bookingStartTime, userId);
          var currentDateTime = moment().utcOffset("+05:30").format().slice(0, 16);
          console.log(currentDateTime);
          bookingMinutes = moment(`${bookingStartTime}`).diff(moment(`${currentDateTime.slice(0, 16)}`), 'minutes');
          console.log(bookingMinutes);
          if (bookingMinutes === 0) {
            console.log(totalParkingLeft)
            if (totalParkingLeft > 0) {
              snapshot.ref.parent.child('Parking Lot A').child('totalParkingLeft').set(totalParkingLeft - 1);
            }
          }
          // else if(bookingMinutes < -5){
          //   const message = {
          //     notification: {
          //       title: 'Booking has began! Are you coming?',
          //       body: 'Give me a heads up if you are coming or your booking will expire automatically and you will be charged'
          //     },
          //     token: token
          //   };

          //   admin.messaging().send(message)
          //     .then((response) => {
          //       // Response is a message ID string.
          //       console.log('Successfully sent message:', response);
          //       return response
          //     })
          //     .catch((error) => {
          //       console.log('Error sending message:', error);
          //     });
          // }
        });
      });

    return null;
  });


//Schedule function to track BOOKING END TIME
exports.scheduledFunctionForBookingOverTime =
  functions.pubsub.schedule('every 1 minutes').onRun((context) => {

    let totalParkingLeft;
    admin.database().ref('Parking Lot A').child('totalParkingLeft')
      .on('value', snapshot => {
        totalParkingLeft = snapshot.val();
      });

    admin.database().ref('Booking').orderByChild('bookingEndTime')
      .on('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          console.log(key)
          let bookingEndingTime = snapshot.child(key).child('bookingEndTime').val();
          let userId = snapshot.child(key).child('userId').val();
          let parkingNumber = snapshot.child(key).child('bookingParkingNumber').val();
          console.log(bookingEndingTime, userId);
          var currentDateTime = moment().utcOffset("+05:30").format().slice(0, 16);
          console.log(currentDateTime);
          let bookingMinutes = moment(`${bookingEndingTime}`).diff(moment(`${currentDateTime.slice(0, 16)}`), 'minutes');
          console.log(bookingMinutes);
          if (bookingMinutes < 10 && bookingMinutes > 0) {
            snapshot.ref.child(key).child('bookingStatus').set(`overtimeHeadsUp_${userId}`);
          }
          else if (bookingMinutes === 0) {
            snapshot.ref.child(key).child('bookingStatus').set(`expired_${userId}`);
            if (totalParkingLeft < 3) {
              snapshot.ref.parent.child('Parking Lot A/totalParkingLeft').set(totalParkingLeft + 1);
            }
          }
          else if (bookingMinutes < 0) {
            snapshot.ref.child(key).child('bookingStatus').set(`expired_${userId}`);
          }
        });
      });
  });

exports.onEntryAccess = functions.database.ref('Parking Lot A/ArrivalSensor')
  .onUpdate((change, context) => {
    const entry = change.after.val();
    if (entry === true) {
      return change.after.ref.parent.child('/entryCapture').set(true);
    }
    if (entry === false) {
      return change.after.ref.parent.child('/entryCapture').set(false);
    }
    return null;
  });

exports.onExitAccess = functions.database.ref('Parking Lot A/ExitSensor')
  .onUpdate((change, context) => {
    const entry = change.after.val();
    if (entry === true) {
      return change.after.ref.parent.child('/exitCapture').set(true);
    }
    if (entry === false) {
      return change.after.ref.parent.child('/exitCapture').set(false);
    }
    return null;
  });

exports.recognizePlate = functions.database.ref('Parking Lot A/plateImg/{pushId}/imgSrc')
  .onCreate(async (snapshot, context) => {
    const imgSrc = snapshot.val();
    console.log(imgSrc);

    try {
      const numberPlate = await fetchNumberPlate(imgSrc, snapshot);
      console.log(numberPlate);
      if (numberPlate === null || numberPlate === undefined) {
        return snapshot.ref.parent.parent.parent.child('Access').set(false);
      }
      else {
        snapshot.ref.parent.update({ entryTime: new Date().getTime() });

        snapshot.ref.parent.parent.parent.parent.child('Booking')
          .orderByChild('numberPlate').equalTo(`${numberPlate}`).once('value', snapshot => {
            if (snapshot.exists()) {
              let key = Object.keys(snapshot.val())[0];
              snapshot.ref.child(key).update({
                arrived: true,
                entryTimeStamp: new Date().getTime()
              });
              console.log("BOOKED ACCESS");
              return snapshot.ref.parent.child('Parking Lot A').child('bookedAccess').set(true);
            }
            else {
              console.log("ACCESS TRUE");
              return snapshot.ref.parent.child('Parking Lot A').child('Access').set(true);
            }
          });
      }
    }
    catch (err) {
      console.log(err);
    }
    return null;
  });

exports.exitRecognizePlate = functions.database.ref('Parking Lot A/exitPlateImage/{pushId}/imgSrc')
  .onCreate(async (snapshot, context) => {
    let messagingToken, parkingFee, bookingData, userId;
    const imgSrc = snapshot.val();
    console.log(imgSrc);

    try {
      const numberPlate = await fetchNumberPlate(imgSrc, snapshot);
      console.log(numberPlate);

      const timeInMins = await calculateParkingTime(numberPlate);
      console.log(timeInMins);

      parkingFee = await calculateParkingFee(timeInMins, snapshot);
      console.log(parkingFee);
      snapshot.ref.parent.update({ timeInMins: timeInMins });

      snapshot.ref.parent.parent.parent.parent.child('Booking')
        .orderByChild('numberPlate').equalTo(`${numberPlate}`).once('value', snapshot => {
          if (snapshot.exists()) {
            let key = Object.keys(snapshot.val())[0];
            bookingData = snapshot.child(key).val();
            userId = snapshot.child(key).val().userId;
            let parkingNumber = snapshot.child(key).val().bookingParkingNumber;
            messagingToken = snapshot.child(key).child('messagingToken').val();
            console.log(parkingNumber, messagingToken)
            admin.database().ref('Parking Lot A').child('parkingStatus')
              .child(`p${parkingNumber}`).set('Empty');
            const message = {
              notification: {
                title: 'Parking Fee',
                body: `You have billed ${parkingFee}Rs!`
              },
              token: messagingToken
            };

            admin.messaging().send(message)
              .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                return response
              })
              .catch((error) => {
                console.log('Error sending message:', error);
              });
            snapshot.ref.parent.child('users').child(`${userId}`).child('previousBooking')
              .update(bookingData);
            snapshot.ref.child(key).remove();
          }
        });

    }
    catch (err) {
      console.log("Something wrong in exit trigger", err);
    }
    console.log("PAYMENT CLEARED");
    return snapshot.ref.parent.parent.parent.child('paymentCleared').set(true);
  });

const fetchNumberPlate = (imgSrc, snapshot) => {
  let numberPlate;
  let body = new FormData();
  body.append('upload', imgSrc);
  return fetch("https://api.platerecognizer.com/v1/plate-reader/", {
    method: 'POST',
    headers: {
      "Authorization": "Token 35bda47cb6bfc8d30890c69c3e3b994f130772db"
    },
    body: body
  })
    .then(res => res.json())
    .then(json => {
      snapshot.ref.parent.parent.parent.child('entryCapture').set(false);
      snapshot.ref.parent.parent.parent.child('exitCapture').set(false);
      if (json.results.length === 0) {
        return null;
      }
      else {
        numberPlate = json.results[0].plate;
        snapshot.ref.parent.update({ numberPlate: json.results[0].plate });
        return numberPlate;
      }
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

const calculateParkingTime = (numberPlate) => {
  let parkingInfoRef = admin.database().ref('Parking Lot A');
  let timeInMins;
  let exitTime = new Date().getTime();

  return parkingInfoRef.child("plateImg").orderByChild("numberPlate")
    .equalTo(`${numberPlate}`).once('value')
    .then((snapshot) => {
      let key = Object.keys(snapshot.val())[0];
      let entryTime = snapshot.child(key).child('entryTime').val();
      console.log(exitTime, entryTime);
      let timeDiffCalc = (exitTime - entryTime);
      console.log(timeDiffCalc)
      timeInMins = Math.abs(Math.round((timeDiffCalc / 60000)));
      return timeInMins;
    })
    .catch(err => err);
}

const calculateParkingFee = (timeInMins, snapshot) => {
  let hours = timeInMins / 60;
  let rhours = Math.floor(timeInMins / 60);
  let minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);

  let parkingFee = 0;
  if (timeInMins && timeInMins < 10) {
    console.log('less than 10');
    return snapshot.ref.parent.parent.parent.child('paymentCleared').set(true);
  }
  else {
    console.log('more than 10');
    parkingFee = Math.floor((rhours + (rminutes / 60)) * 100);
    console.log(parkingFee);
    return snapshot.ref.parent.update({ parkingFee: parkingFee });
  }
}
