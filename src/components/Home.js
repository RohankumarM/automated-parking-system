import React from 'react';
import '../styles/Home.css';

class Home extends React.Component {

  render() {
    return (
      <div className="home">
        <div className="intro">
          <h2>Welcome to the Intelligent Parking System</h2>
          <h5>I am here to help you find parking places which are available before you step out of your house.</h5>
        </div>
      </div>
    )
  }
}

export default Home;
