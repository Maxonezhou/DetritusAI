import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  { Container } from 'reactstrap';
import Navbar from './NavBar';
import { Map, GoogleApiWrapper } from 'google-maps-react';


const mapStyles = {
    width: '100%',
    height: '100%',
  };

  export class MapContainer extends Component {
    render() {
      return (
        <div>
            <Navbar></Navbar>
            <Map
            google={this.props.google}
            zoom={14}
            style={mapStyles}
            initialCenter={{
            lat: 43.6629,
            lng: -79.3957
            }}
            />
        </div>
      );
    }
  }

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBA6jivxyYtRCXf0xgmagNinimE8Spq0yU'
  })(MapContainer);