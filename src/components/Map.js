import React from 'react';
import { Map as GoogleMaps, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import ParkingCard from './ParkingCard';
import InfoWindowEx from './InfoWindowEx';
import * as firebase from 'firebase';

const mapStyles = {
  width: '50%',
  height: '90%',
};

export class Map extends React.Component {
  state = {
    showingInfoWindow: false,  // Hides or shows the InfoWindow
    activeMarker: {},          // Shows the active marker upon click
    selectedPlace: {},          // Shows the InfoWindow to the selected place upon a marker
    location: '',
    status: [],
    parkingFullStatus: false,
    totalParkingSpace: 5,
    currentLatLng: null,
    totalParkingLeft: 5
  };

  componentDidMount() {
    const rootRef = firebase.database().ref().child("Parking Lot A");
    rootRef.on('value', snapshot => {
      var data = snapshot.val();
      console.log(data);
      this.setState({
        location: data.Location,
        status: data.parkingStatus,
        totalParkingSpace: data.totalParkingSpace,
        totalParkingLeft: data.totalParkingLeft,
        parkingFullStatus: data.parkingFullStatus
      });
    });

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        currentLatLng: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
    });
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  locationLatLng = {
    lat: 21.2352936,
    lng: 72.8544311,
  };

  render() {

    return (
      <div className="map">
        <GoogleMaps
          google={this.props.google}
          zoom={12}
          style={mapStyles}
          initialCenter={this.locationLatLng}
        >

          <Marker
            onClick={this.onMarkerClick}
            name={'Amroli'}
            icon={this.state.parkingFullStatus === true ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}
          />
          <InfoWindowEx
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <ParkingCard
              location={this.state.location} 
              status={this.state.status}
              fullStatus={this.state.parkingFullStatus}
              totalParkingLeft={this.state.totalParkingLeft}
              totalParkingSpace={this.state.totalParkingSpace}
              />
            </div>
          </InfoWindowEx>
        </GoogleMaps>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY
})(Map);

