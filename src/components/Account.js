import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../shared/context/authContext';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import fire from '../base';
import Loading from './Loading';
import '../styles/account.css';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const Account = () => {

  // const webcamRef = React.useRef(null);
  // const [imgSrc, setImgSrc] = React.useState(null);
  // const videoConstraints = {
  //   width: 600,
  //   height: 600,
  //   facingMode: "user",
  // };

  const authContext = useContext(AuthContext);
  const [accountInfo, setAccountInfo] = useState();
  const [previousBookingData, setPreviousBookingData] = useState([]);
  const [currentBookingData, setCurrentBookingData] = useState([]);
  // const [entryCapturePlate, setEntryCapturePlate] = useState(false);
  // const [exitCapturePlate, setExitCapturePlate] = useState(false);
  const [paymentCleared, setPaymentCleared] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(false);
  // const [paymentCleared, setPaymentCleared] = useState(true);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const bookingInfo = fire.database().ref('Booking');
    //fetching previous booking
    fire.database().ref('users').orderByKey().equalTo(`${authContext.userID}`)
      .on('value', (snapshot) => {
        let previousData = Object.values(snapshot.val());
        setPreviousBookingData(previousData[0].previousBooking);
      });

    bookingInfo.orderByChild("bookingStatus").equalTo(`active_${authContext.userID}`)
      .on("value", (snapshot) => {
        console.log(snapshot.val());
        setCurrentBookingData(snapshot.val());
      });

    //fetching User Info
    fire.database().ref('users').orderByKey().equalTo(`${authContext.userID}`)
      .on('value', snapshot => {
        const userInfo = Object.values(snapshot.val());
        setAccountInfo(userInfo[0]);
      })


  }, [])


console.log(previousBookingData)
  const handlePayment = () => {
    setPaymentCleared(true);
  }


  return (
    <div className="account">
      {accountInfo ? <div className="account-info">
        <div className="account-data">
          <h3>Name</h3>
          <p>{accountInfo.username}</p>
        </div>
        <div className="account-data">
          <h3>Email</h3>
          <p>{accountInfo.email}</p>
        </div>
        <div className="account-data">
          <h3>Number Plate</h3>
          <p>{accountInfo.numberPlate}</p>
        </div>
      </div> : <Loading />}

      {currentBookingData || previousBookingData
        ? <div><Accordion className="account-container">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="heading">All Bookings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="text">
              <div className="previous-booking">
                <TableContainer component={Paper}>
                  <Table className="table-container" aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Location</StyledTableCell>
                        <StyledTableCell align="right">Full Name</StyledTableCell>
                        <StyledTableCell align="right">Start Time</StyledTableCell>
                        <StyledTableCell align="right">End Time</StyledTableCell>
                        <StyledTableCell align="right">Number Plate</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previousBookingData === null ? <Loading />
                        : Object.keys(previousBookingData).map((dataId, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                              Amroli
                          </StyledTableCell>
                            <StyledTableCell align="right">{previousBookingData[dataId].fullName}</StyledTableCell>
                            <StyledTableCell align="right">{previousBookingData[dataId].bookingStartTime}</StyledTableCell>
                            <StyledTableCell align="right">{previousBookingData[dataId].bookingEndTime}</StyledTableCell>
                            <StyledTableCell align="right">{previousBookingData[dataId].numberPlate}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className="heading">Current Booking</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {currentBookingData ? <div className="previous-booking">
                  <TableContainer component={Paper}>
                    <Table className="table-container" aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Location</StyledTableCell>
                          <StyledTableCell align="right">Full Name</StyledTableCell>
                          <StyledTableCell align="right">Start Time</StyledTableCell>
                          <StyledTableCell align="right">End Time</StyledTableCell>
                          <StyledTableCell align="right">Number Plate</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.keys(currentBookingData).map((dataId, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                              Amroli
                          </StyledTableCell>
                            <StyledTableCell align="right">{currentBookingData[dataId].fullName}</StyledTableCell>
                            <StyledTableCell align="right">{currentBookingData[dataId].bookingStartTime}</StyledTableCell>
                            <StyledTableCell align="right">{currentBookingData[dataId].bookingEndTime}</StyledTableCell>
                            <StyledTableCell align="right">{currentBookingData[dataId].numberPlate}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                  : <div>You have no current booking, plan one right now. </div>}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        : <div><Accordion className="account-container">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="heading">All Bookings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="text">
              Go ahead and plan your first booking with us!
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className="heading">Current Booking</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Go ahead and plan your first booking with us!
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>}
      <div className="payment">
        {paymentInfo ? <div><button onClick={handlePayment}>PAY</button></div>
          : <div>No payment Info</div>
        }
      </div>

      {/* <Webcam
        audio={false}
        height={600}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={600}
        videoConstraints={videoConstraints} />
      <button onClick={capture}>Capture photo</button>
      {imgSrc && (
        <img
          src={imgSrc}
        />
      )} */}
    </div>
  )
}

export default Account;


