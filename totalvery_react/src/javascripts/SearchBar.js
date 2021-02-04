import React, { Component } from "react";
import { withGoogleMap, withScriptjs } from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import { Redirect } from "react-router";
import { GoogleMapsAPI } from "../client-config";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class SearchBar extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      street: "",
      route: "",
      city: "",
      area: "",
      areaShort: "",
      state: "",
      postal_code: "",
      mapPosition: {
        lat: 0,
        lng: 0,
      },
      reference: "",
      location: "",
      redirectToReferrer: false,
    };
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };
  getStreet = (addressArray) => {
    let street = "",
      route = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "street_number" === addressArray[i].types[0]
      ) {
        street = addressArray[i].long_name;
      } else if (
        addressArray[i].types[0] &&
        "route" === addressArray[i].types[0]
      ) {
        route = addressArray[i].short_name;
      }
    }
    return [street, route];
  };
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = (addressArray) => {
    let area = "",
      areaShort = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            areaShort = addressArray[i].short_name;
            return [area, areaShort];
          }
        }
      }
    }
  };

  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].short_name;
          return state;
        }
      }
    }
  };
  getPostalCode = (addressArray) => {
    let postal_code = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "postal_code" === addressArray[i].types[0]
        ) {
          postal_code = addressArray[i].short_name;
          return postal_code;
        }
      }
    }
  };
  onPlaceSelected = (place) => {
    console.log("plc", place);

    const address = place.formatted_address,
      addressArray = place.address_components,
      street = this.getStreet(addressArray)
        ? this.getStreet(addressArray)[0]
        : "",
      route = this.getStreet(addressArray)
        ? this.getStreet(addressArray)[1]
        : "",
      city = this.getCity(addressArray),
      area = this.getArea(addressArray) ? this.getArea(addressArray)[0] : "",
      areaShort = this.getArea(addressArray)
        ? this.getArea(addressArray)[1]
        : "",
      state = this.getState(addressArray),
      postal_code = this.getPostalCode(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng(),
      reference = place.place_id;

    // Set these values in the state.
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      street: street ? street : "",
      route: route ? route : "",
      city: city ? city : "",
      areaShort: areaShort ? areaShort : "",
      state: state ? state : "",
      postal_code: postal_code ? postal_code : "",
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
      reference: reference,
    });
    //redirect to /search
    this.setState({
      redirectToReferrer: true,
    });
    this.handleCookie();
  };
  handleCookie = () => {
    const { cookies } = this.props;
    let locJson = null;
    if (this.state.postal_code != "") {
      locJson = {
        address: {
          address1: this.state.street + " " + this.state.route,
          address2: this.state.area + ", " + this.state.state,
          aptOrSuite: "",
          eaterFormattedAddress: this.state.address,
          subtitle: this.state.area + ", " + this.state.state,
          title: this.state.street + " " + this.state.route,
          uuid: "",
        },
        latitude: this.state.mapPosition.lat,
        longitude: this.state.mapPosition.lng,
        reference: this.state.reference,
        referenceType: "google_places",
        type: "google_places",
        source: "manual_auto_complete",
        addressComponents: {
          countryCode: "US",
          firstLevelSubdivisionCode: this.state.state,
          city: this.state.areaShort,
          postalCode: this.state.postal_code,
        },
        originType: "user_autocomplete",
      };
    } else {
      let fullAddress = this.state.address;
      let splitFullAddress = fullAddress.split(", ");
      locJson = {
        address: {
          address1: splitFullAddress[0],
          address2: splitFullAddress[1],
          aptOrSuite: "",
          eaterFormattedAddress: this.state.address,
          subtitle: splitFullAddress[1],
          title: splitFullAddress[0],
          uuid: "",
        },
        latitude: this.state.mapPosition.lat,
        longitude: this.state.mapPosition.lng,
        reference: this.state.reference,
        referenceType: "google_places",
        type: "google_places",
        source: "manual_auto_complete",
        addressComponents: {
          countryCode: "",
          firstLevelSubdivisionCode: "",
          city: "",
          postalCode: "",
        },
        originType: "user_autocomplete",
      };
    }

    cookies.set("tv.loc", JSON.stringify(locJson), { path: "/" });
  };

  render() {
    const redirectToReferrer = this.state.redirectToReferrer;
    if (redirectToReferrer) {
      this.setState({
        redirectToReferrer: false,
      });
      return (
        <Redirect
          to={{
            pathname: `/search/${this.state.mapPosition.lat}/${this.state.mapPosition.lng}`,
            state: {
              location: this.state.address,
              lat:this.state.mapPosition.lat,
              lon:this.state.mapPosition.lon,
            },
          }}
        />
      );
    }
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <Autocomplete
          style={{
            width: "420px",
            height: "40px",
            paddingLeft: "16px",
            marginTop: "2px",
            marginBottom: "500px",
            fontSize: "20px",
          }}
          onPlaceSelected={this.onPlaceSelected}
          types={[]}
          type="text"
          name="location"
        />
      ))
    );
    let map;
    map = (
      <AsyncMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places&v=weekly`}
        loadingElement={<div style={{ height: `0%` }} />}
        containerElement={<div style={{ height: `0%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );

    return map;
  }
}

export default withCookies(SearchBar);
