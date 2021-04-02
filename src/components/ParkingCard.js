import React from 'react';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// import MailIcon from '@material-ui/icons/Mail';
// import parkingSpace from '../images/parking-space.svg';
import "../styles/ParkingCard.css";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& > *': {
//       margin: theme.spacing(1),
//     },
//   },
// }));


const ParkingCard = ({ status, fullStatus, totalParkingLeft, totalParkingSpace }) => {
  // state = {
  //   location: this.props.location,
  //   status: this.props.status,
  //   fullStatus: this.props.fullStatus,
  //   totalParkingLeft: this.props.totalParkingLeft,
  //   totalParkingSpace: this.props.totalParkingSpace,
  //   inputStyle: '',
  // };
  // const classes = useStyles();

  // let EmptyStyle = {
  //   borderTop: '6px solid green'
  // };
  // let FullStyle = {
  //   borderTop: '6px solid red'
  // };

  // const handleBooking = (e) => {
  //   console.log('booking');
  // }

  return (
    <div className="parkingCard">
      {/* <div className="app-left">

          <Card className="root">
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h6">
                  Parking at {this.state.location}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Total Parking: {this.state.totalParkingSpace}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Available Parking: {this.state.totalParkingLeft}
                </Typography>
              </CardContent>
            </CardActionArea>
            {this.state.fullStatus === 'Full' ? <div className="booking-status">Parking Full, Check back in sometime!</div>
              : <div className="booking-status">Click on Book Tab to book parking</div>}
          </Card>
        </div> */}
      {totalParkingLeft === '' || totalParkingSpace === '' ? <CircularProgress />
        : <div>
          <Typography variant="body2" color="textSecondary" component="p">
            Total Parking Space: {totalParkingSpace}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Available Parking Space: {totalParkingLeft}
          </Typography>
        </div>
      }

      {/* <div className="car-status-display">
          {Object.entries(this.props.status).map((status, index) => {
            let borderStyle = (status[1] === 'Full') ? FullStyle : EmptyStyle;
            if (status[1] === 'Full') {
              return (<Paper key={index} style={borderStyle} className="car-display">
                <h4>{index + 1}</h4>
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/car-booking-1817189-1538057.png"
                  alt="car" />

              </Paper>)
            }
            else {
              return (<Paper style={borderStyle} className="car-display">
                <h4>{index + 1}</h4>
              </Paper>
              )
            }
          })
          }
        </div> */}

    </div>
  )
}

export default ParkingCard;
