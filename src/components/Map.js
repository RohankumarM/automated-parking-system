import React, { createRef } from 'react';
import { Map as GoogleMaps, GoogleApiWrapper, Marker } from 'google-maps-react';
import * as firebase from 'firebase';
import '../styles/Map.css';

const mapStyles = {
  width: '350px',
  height: '200px',
  margin: '30px 0 40px',
  minWidth: '40%'
};

export class Map extends React.Component {
  state = {
    activeMarker: {},          // Shows the active marker upon click
    selectedPlace: {},          // Shows the InfoWindow to the selected place upon a marker
    location: '',
    status: [],
    parkingFullStatus: false,
    totalParkingSpace: 5,
    currentLatLng: null,
    totalParkingLeft: 5,
    bookNow: false,
    lat: 0,
    lng: 0,
  };

  componentDidMount() {
    const rootRef = firebase.database().ref().child("Parking Lot A");
    rootRef.on('value', snapshot => {
      var data = snapshot.val();
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

  componentDidMount() {
    this.setState({
      lat: this.props.selectedLocation.latitude,
      lng: this.props.selectedLocation.longitude
    })
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      bookNow: true
    });

  // onClose = props => {
  //   if (this.state.showingInfoWindow) {
  //     this.setState({
  //       showingInfoWindow: false,
  //       activeMarker: null
  //     });
  //   }
  // };

  bookingHandler = () => {
    this.setState({
      bookNow: true
    })
  }

  render() {
    let mapRef = createRef();

    return (
      <div className="map" key={this.props.selectedLocation.latitude}>
        <GoogleMaps
          ref={mapRef}
          google={this.props.google}
          zoom={15}
          style={mapStyles}
          initialCenter={{
            lat: this.props.selectedLocation.latitude,
            lng: this.props.selectedLocation.longitude
          }}
          center={{
            lat: this.props.selectedLocation.latitude,
            lng: this.props.selectedLocation.longitude
          }}
        >

          <Marker
            onClick={this.onMarkerClick}
            name={'Amroli'}
            icon={this.state.parkingFullStatus === true ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}
            animation={2}
          />
        </GoogleMaps>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY
})(Map);

