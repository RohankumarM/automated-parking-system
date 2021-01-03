import React, { Component } from 'react';
import Map from './Map';
import fire from '../base';
import BarChart from './BarChart';
import '../styles/FindSpace.css';


class FindSpace extends Component {
  state = {
    location: "",
    status: [],
    totalParkingSpace: 20,
    inputStyle: ''
  };

  handleSignout = () => {
    fire.auth().signOut();
    this.setState({
      isLoggedIn: false
    });
  };

  mapStyles = {
    width: '100%',
    height: '100%'
  };

  render() {
    return (
      <div className="findSpace">
        <div className="left">
          {/* Display MAP */}
          <Map />
        </div>

        <div className="right">
          <div className="data-visualization">
            <BarChart />
          </div>
        </div>

      </div>
    )
  }
};

export default FindSpace;


