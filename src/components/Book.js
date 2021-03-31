import React, { useContext, useEffect, useState } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { AuthContext } from '../shared/context/authContext';
import Booking from '../images/booking.svg';
import moment from 'moment';
import fire from '../base';
import momentLocalizer from 'react-widgets-moment';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { useHistory } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import '../styles/Book.css';

const Book = (props) => {

  moment.locale('en');
  momentLocalizer();

  const history = useHistory();
  const messaging = fire.messaging();

  const authContext = useContext(AuthContext);
  let minDate = moment().utcOffset("+05:30").format().slice(0, 16);
  let max = moment().add(2, 'days');
  let maxDate = moment(max._d).utcOffset("+05:30").format().slice(0, 16);

  let bookingInfo;
  const [locationSelect, setLocationSelect] = useState();
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [fullName, setFullName] = useState([]);
  const [numberPlate, setNumberPlate] = useState([]);
  const [bookingStartTime, setBookingStartTime] = useState();
  const [bookingEndTime, setBookingEndTime] = useState();
  const [showBookingForm, setShowBookingForm] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [bookingNo, setBookingNo] = useState();
  const [arrivedStatus, setArrivedStatus] = useState(false);
  const [messagingToken, setMessagingToken] = useState();

  // let bookingReservedTime = 0;

  useEffect(() => {
    if (bookingConfirmed) {
      history.push('/account');
    }

    messaging.requestPermission().then(() => {
      return messaging.getToken()
    }).then(token => {
      console.log(token)
      setMessagingToken(token);
      return token;
    })
      .catch(err => {
        console.log(err);
        return err;
      })
  }, []);

  fire.messaging().onMessage(notification => {
    alert('Notification received!', notification);
  });

  useEffect(() => {
    if (authContext.userID) {
      fire.database().ref('Booking').orderByChild('userId').equalTo(`${authContext.userID}`)
        .once('value', (snapshot) => {
          if (snapshot.exists()) {
            setShowBookingForm(false);
            // console.log(Object.keys(snapshot.val())[0]);
            let key = Object.keys(snapshot.val())[0];
            // console.log(snapshot.child(key).val());
            setBookingNo(key);
            setBookingData(snapshot.child(key).val());
            if (snapshot.child(key).val().arrived) {
              setArrivedStatus(true);
            }
            else {
              setArrivedStatus(false);
            }
          }
        });
    }
  }, [showBookingForm]);


  if (bookingStartTime && bookingEndTime) {
    bookingInfo = {
      location: locationSelect,
      userID: authContext.userID,
      fullName,
      numberPlate,
      bookingStartTime: moment(bookingStartTime).utcOffset("+05:30").format().slice(0, 16),
      bookingEndTime: moment(bookingEndTime).utcOffset("+05:30").format().slice(0, 16),
      bookingStatus: `active_${authContext.userID}`,
      messagingToken
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    await fetch('https://us-central1-smart-parking-system-9d0dc.cloudfunctions.net/newBooking', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(bookingInfo)
    })
      .then((response) => {
        console.log(response);
        setShowBookingForm(false);
      })
      .catch(err => {
        console.log('Error occurred while booking, Sorry!', err);
      });
  }


  return (
    <Paper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="book">
          <div className="booking__header">
            <img className="booking__header__logo" src={Booking} alt="booking" />
            <h1 className="booking__header__title">Book your parking</h1>
          </div>
          {showBookingForm ? <div className="bookingForm-container">
            <form className="bookingForm" onSubmit={handleBooking}>
              <div className="booking-input">
                <LocationOnRoundedIcon className="icon" />
                <select autoFocus name="cars" className="dropdown" value={locationSelect} onChange={e => setLocationSelect(e.target.value)}>
                  <option>Select a location</option>
                  <option value="Amroli">Amroli</option>
                  <option value="Adajan">Adajan</option>
                </select>
              </div>
              <div className="booking-input">
                <PersonIcon className="icon" />
                <input required type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)}></input>
              </div>
              <div className="booking-input">
                <img className="number-plate" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/number-plate-1582888-1337733.png" alt="number plate" />
                <input type="text" placeholder="Number Plate" value={numberPlate} required onChange={e => setNumberPlate(e.target.value)}></input>
              </div>
              <div className="booking-input">
                <AccessTimeIcon className="icon" />
                <KeyboardDateTimePicker
                  value={bookingStartTime}
                  onChange={setBookingStartTime}
                  label="Booking Start Time"
                  onError={console.log}
                  minDate={minDate}
                  maxDate={maxDate}
                  format="yyyy/MM/dd hh:mm a"
                  minutesStep={15}
                />
              </div>
              <div className="booking-input">
                <AccessTimeIcon className="icon" />
                <KeyboardDateTimePicker
                  value={bookingEndTime}
                  onChange={setBookingEndTime}
                  label="Booking End Time"
                  onError={console.log}
                  minDate={minDate}
                  maxDate={maxDate}
                  format="yyyy/MM/dd hh:mm a"
                  minutesStep={15}
                />
              </div>
              <input type="submit" value="Book" className="booking-btn" />
            </form>
          </div>
            : <div className="booking-receipt">
              <div className="booking-receipt-header">Booking Receipt</div>
              <div className="booking-receipt-container">
                <table className="receipt-info">
                  <tbody>
                    <tr>
                      <th>Full Name</th>
                      <th>Booking No.</th>
                    </tr>
                    <tr>
                      <td>{bookingData.fullName}</td>
                      <td>{bookingNo}</td>
                    </tr>
                    <tr>
                      <th>Booking Start Time: </th>
                      <th>Booking End Time: </th>
                    </tr>
                    <tr>
                      <td>{moment(bookingData.bookingStartTime).format('MMMM Do YYYY, h:mm a')}</td>
                      <td>{moment(bookingData.bookingEndTime).format('MMMM Do YYYY, h:mm a')}</td>
                    </tr>
                    <tr>
                      <th>Number Plate</th>
                      <th colSpan="2">Parking Number</th>
                    </tr>
                    <tr>
                      <td>{bookingData.numberPlate}</td>
                      <td>{bookingData.bookingParkingNumber}</td>
                    </tr>
                    <tr className="parking-status">
                      <th>Parking Status:</th>
                      <td>{arrivedStatus ? 'Arrived' : 'Not yet Arrived'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div >
      </MuiPickersUtilsProvider>
    </Paper>
  )
}

export default Book;
