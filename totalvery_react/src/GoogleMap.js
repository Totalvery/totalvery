import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

// const marker = ({ text }) => (
//     <div style={{
//       color: 'white', 
//       background: 'grey',
//       padding: '15px 10px',
//       display: 'inline-flex',
//       textAlign: 'center',
//       alignItems: 'center',
//       justifyContent: 'center',
//       borderRadius: '100%',
//       transform: 'translate(-50%, -50%)'
//     }}>
//       {text}
//     </div>
//   );

class GoogleMap extends Component {
  static defaultProps = {
    center: {
      lat: 40.756795,
      lng: -73.954298
    },
    zoom: 13
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div className='googlemap' style={{ height: '600px', width: '1000px'}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAqrOgdghd-jiq0awWFsg1snmSgpY3aS2c' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {/* <marker
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          /> */}
        </GoogleMapReact>
      </div>
    );
  }
}

export default GoogleMap;