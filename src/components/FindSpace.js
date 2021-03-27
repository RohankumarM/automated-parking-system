import React, { useState } from 'react';
import Map from './Map';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BarChart from './BarChart';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import '../styles/FindSpace.css';

const parkingLocations = [
  { place: 'Amroli', latitude: 21.2352936, longitude: 72.8544311, image: "https://i.ytimg.com/vi/B3dgu3DhQDU/maxresdefault.jpg" },
  { place: 'Adajan', latitude: 21.198678, longitude: 72.784782, image: "https://media-cdn.tripadvisor.com/media/photo-s/19/ae/c0/a5/car-parking-available.jpg" }
];

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
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


  // function handleSignout = () => {
  //   fire.auth().signOut();
  //   this.setState({
  //     isLoggedIn: false
  //   });
  // };

  return (
    <div className="findSpace">

      <div className="display__place">
        <div className="findSpace__search__top">
          <Autocomplete
            id="parking__location__searchbox"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
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
            {/* Display MAP */}
            <Map selectedLocation={value} />
          </div>

          <div className="findSpace__search__map__right">
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={value.image}
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {value.place}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  <Link to="/book">
                    Book now
                  </Link>
                </Button>
              </CardActions>
            </Card>
          </div>
        </div>

        <div className="bar__chart">
          <div className="data-visualization">
            <BarChart />
          </div>
        </div>
      </div>

    </div>
  )
};

export default FindSpace;


