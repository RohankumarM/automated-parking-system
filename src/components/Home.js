import { Typography } from '@material-ui/core';
import React from 'react';
import '../styles/Home.css';
import BarChart from './BarChart';

class Home extends React.Component {

  render() {
    return (
      <div className="home">
        <div className="intro">
          <h2>Welcome to the Intelligent Parking System</h2>
          <h5>I am here to help you find parking places which are available before you step out of your house.</h5>
          
          <div className="bar__chart">
            <Typography className="statistics__title">Parking Statistics for every week</Typography>
            <div className="data-visualization">
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
