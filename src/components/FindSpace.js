import React, { useState, useEffect } from 'react';
import Map from './Map';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ParkingCard from './ParkingCard';
import * as firebase from 'firebase';
import '../styles/FindSpace.css';

const parkingLocations = [
  { place: 'Amroli', latitude: 21.2352936, longitude: 72.8544311, image: "https://i.ytimg.com/vi/B3dgu3DhQDU/maxresdefault.jpg" },
  { place: 'Adajan', latitude: 21.198678, longitude: 72.784782, image: "https://media-cdn.tripadvisor.com/media/photo-s/19/ae/c0/a5/car-parking-available.jpg" }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: '300px'
  },
  media: {
    height: 140,
  },
});

const FindSpace = () => {
  // state = {
  //   location: "",
  //   status: [],
  //   totalParkingSpace: 20,
  //   inputStyle: '', 
  //   value: parkingLocations[0],
  // };
  const classes = useStyles();

  const [value, setValue] = useState(parkingLocations[0]);
  const [inputValue, setInputValue] = useState('');
  const [parkingStatus, setParkingStatus] = useState([]);
  const [parkingFullStatus, setParkingFullStatus] = useState(false);
  const [totalParkingLeft, setTotalParkingLeft] = useState('');
  const [totalParkingSpace, setTotalParkingSpace] = useState('');

  useEffect(() => {
    firebase.database().ref('/Parking Lot A')
      .on('value', snapshot => {
        const data = snapshot.val();
        setParkingStatus(data.parkingStatus);
        setParkingFullStatus(data.parkingFullStatus);
        setTotalParkingLeft(data.totalParkingLeft);
        setTotalParkingSpace(data.totalParkingSpace);
      })
  }, []);

  // function handleSignout = () => {
  //   fire.auth().signOut();
  //   this.setState({
  //     isLoggedIn: false
  //   });
  // };

  return (
    <div className="findSpace">
      <Typography className="findSpace__title">Search For Parking</Typography>
      <div className="display__place">
        <div className="findSpace__search__top">
          <Autocomplete
            className="parking__location__searchbox"
            value={value}
            onChange={(event, newValue) => {
              newValue === null ? setValue(parkingLocations[0]) : setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={parkingLocations}
            getOptionLabel={(option) => option.place}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Select Location" variant="outlined" />}
          />
        </div>

        <div className="findSpace__search__map">

          <div className="findSpace__search__map__left">
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={value.image}
                  title={value.place}
                />
                <CardContent>
                  <Typography style={{ display: 'flex', justifyContent: 'center'}} gutterBottom variant="h5" component="h2">
                    {value.place}
                  </Typography>
                  <ParkingCard
                    location={value.place}
                    status={parkingStatus}
                    fullStatus={parkingFullStatus}
                    totalParkingLeft={totalParkingLeft}
                    totalParkingSpace={totalParkingSpace} />
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  {totalParkingLeft === 0 ? <Typography>Full</Typography> : <Link to="/book" className="book__now__btn">
                    Book now
                  </Link>}
                </Button>
              </CardActions>
            </Card>
          </div>

          <div className="findSpace__search__map__right">
            {/* Display MAP */}
            <Map selectedLocation={value} />
          </div>
        </div>
      </div>

    </div>
  )
};

export default FindSpace;


