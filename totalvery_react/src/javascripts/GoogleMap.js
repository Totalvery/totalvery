import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { bootstrapURLKeys } from "./client-config";

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      color: "white",
      background: "black",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {text}
  </div>
);

class GoogleMap extends Component {
  render() {
    return (
      <div className="googlemap" style={{ height: "500px", width: "850px" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: bootstrapURLKeys }}
          defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
          defaultZoom={15}
        >
          <AnyReactComponent
            lat={this.props.lat}
            lng={this.props.lng}
            text={"Your Location"}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default GoogleMap;
