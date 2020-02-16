// /*global google*/

// import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import  { Container } from 'reactstrap';
// import Navbar from './NavBar';
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
// //import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
// import {
//     useLoadScript,
//     GoogleMap,
//     InfoWindow
//   } from "@react-google-maps/api";

// import messaging from '../Messaging';
// import Paho from 'paho-mqtt';

//   const mapStyles = {
//     width: '100%',
//     height: '100%',
//   };

//   export class MapContainer extends Component {
//     //populate with solace data
//     constructor(props){
//         super(props);
//         this.state = {
//             connected: false,
//             isOpen: false,
//             markers: [{latitude: 43.65, longitude: -79.40},
//                 {latitude: 47.359423, longitude: -122.021071},
//                 {latitude: 47.2052192687988, longitude: -121.988426208496},
//                 {latitude: 47.6307081, longitude: -122.1434325},
//                 {latitude: 47.3084488, longitude: -122.2140121}],
//             messages: []
//         }

//         messaging.register(this.handleMessage.bind(this));

//         messaging.connectWithPromise().then(response => {
//             console.log("Succesfully connected to Solace Cloud.", response);
//             messaging.subscribe("/location");

//             this.state.messages.push(this.state.messages);
//             // this.setState({
//             //     connected: true,
//             //     messages: this.state.messages
//             // });
//         }).catch(error => {
//             console.log("Unable to establish connection with Solace Cloud, see above logs for more details.", error);
//         });
//     };

//     //infor window of the markers
//     handleToggleOpen = () => {
//         this.setState({
//           isOpen: true,
//         });
//     };
    
//     handleToggleClose = () => {
//         this.setState({
//           isOpen: false,
//         });
//     };

//     // Iterate myPlaces to size, center, and zoom map to contain all markers
//     fitBounds = map => {
//         const bounds = new window.google.maps.LatLngBounds();
//         markers.map(marker => {
//         bounds.extend(marker.pos);
//         return marker.id;
//         });
//         map.fitBounds(bounds);
//     };

//    loadHandler = map => {
//     // Store a reference to the google map instance in state
//     setMapRef(map);
//     // Fit map bounds to contain all markers
//     fitBounds(map);
//   };

//   // We have to create a mapping of our places to actual Marker objects
//    markerLoadHandler = (marker, place) => {
//     return setMarkerMap(prevState => {
//       return { ...prevState, [place.id]: marker };
//     });
//   };

//     markerClickHandler = (event, place) => {
//     // Remember which place was clicked
//     setSelectedPlace(place);

//     // Required so clicking a 2nd marker works as expected
//     if (infoOpen) {
//       setInfoOpen(false);
//     }

//     setInfoOpen(true);


//     // if you want to center the selected Marker
//     setCenter(marker.pos)
//     };

//     //display a list of static markers
//     displayMarkers = () => {
//         return this.state.markers.map((marker, index) => {

//             return <Marker
//                 key={index} id={index} position={{
//                     lat: marker.latitude,
//                     lng: marker.longitude
//                 }}
//                 onClick={() => this.handleToggleOpen()}>

//                 {this.state.isOpen && (
//                 <InfoWindow onCloseClick={() => this.handleToggleClose()}>
//                     <span>Something</span>
//                 </InfoWindow>
//                 )}

//                 </Marker>
//         })

//     }


//     //render the map and markers
//     render() {
//       return (

//          <div>
//              <Navbar></Navbar>

//             <Map 
//                 google={this.props.google}
//                 zoom={14}
//                 style={mapStyles}
//                 initialCenter={{
//                 lat: 43.6629,
//                 lng: -79.3957
//                 }}
//             >

//                 {this.displayMarkers()}

//             </Map>
//          </div>
//       )
//     }


//     handleMessage(message) {
// 		this.setState(state => {


// 			const messages = state.messages.concat(message.payloadString);
// 			return {
// 				messages,
// 				connected: state.connected,
// 			};
// 		  });
//     }
    

// 	handleSendClick() {
// 		let message = new Paho.Message(JSON.stringify({text: "Hello"}));
// 		message.destinationName = "exampletopic";
// 		messaging.send(message);
// 	}

// 	handleConnectClick() {
// 		if (this.state.connected) {
// 			messaging.disconnect();
// 			this.setState({
// 				connected: false,
// 				messages: this.state.messages
// 			});
// 		} else {
// 			messaging.connectWithPromise().then(response => {
// 				console.log("Succesfully connected to Solace Cloud.", response);
// 				messaging.subscribe("exampletopic");
// 				this.setState({
// 					connected: true,
// 					messages: this.state.messages
// 				});
// 			}).catch(error => {
// 				console.log("Unable to establish connection with Solace Cloud, see above logs for more details.", error);
// 			});
// 		}
// 	}

// }

// export default GoogleApiWrapper({
//     apiKey: 'AIzaSyB0PKakIGKL9F4veyAeaD4mIXl28CDxJ-U'
//   })(MapContainer);