import React from "react";
import TopBar from "./TopBar";
import ImgTest from "./ImgTest";

import UberEats from "./StoreDetail/UberEats";
import DoorDash from "./StoreDetail/DoorDash";
import GrubHub from "./StoreDetail/GrubHub";

import "./App.css";

class RequestsTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      representative: null,
      heroImageUrl: null,
      title: null,
      address: null,
      priceRange: null,
      json_data: [],
      isOpen: null,
      subNav: [],
      sectionEntitiesMap: [],
    };
  }

  componentDidMount() {
    // this is an example for the request body
    const payload = {
      meta: { ubereats: "false", doordash: "true", grubhub: "true" },
      ids: {
        ubereatsID: "345b3c6f-8d4b-4990-94f5-d091e337ecec",
        doordashID: "855640",
        grubhubID: "2026708",
      },
      customer_location: { latitude: "37.7581925", longitude: "-122.4121704" },
    };

    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    fetch("http://127.0.0.1:8000/api/getStoreDetails/", requestOptions)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          representative: data.representative,
          heroImageUrl: data.heroImageUrl,
          title: data.title,
          address: data.location.address,
          priceRange: data.priceRange,
          isOpen: data.isOpen,
          json_data: data,
        })
      );
  }

  render() {
    let header = null;
    if (this.state.heroImageUrl === "") {
      header = <div className="no-header-img"></div>;
    } else {
      header = <ImgTest heroImageUrl={this.state.heroImageUrl} />;
    }
    console.log(this.state.json_data);
    var fees = "";
    if (this.state.isOpen === false) {
      fees = "Closed";
    } else if (this.state.isOpen === true) {
      fees = "Opened";
    }

    // console.log(this.state.subNav);

    // const menu = this.state.subNav.map((each) => <Menu subNav={each} />);
    // console.log("menu: " + menu);
    // menu.forEach((item, i) => {
    //   console.log(item);
    // });

    var menuApp = null;
    if (this.state.representative === "ubereats") {
      menuApp = <UberEats json_data={this.state.json_data} />;
    } else if (this.state.representative === "doordash") {
      menuApp = <DoorDash json_data={this.state.json_data} />;
    } else if (this.state.representative === "grubhub") {
      menuApp = <GrubHub json_data={this.state.json_data} />;
    }

    return (
      <div>
        <TopBar />
        {header}
        <div className="store-detail">
          <h1 className="store-title">{this.state.title}</h1>
          <div className="priceRange">{this.state.priceRange}</div>
          <div className="address">{this.state.address}</div>
        </div>
        <div className="fees-wrapper">{fees}</div>
        {menuApp}
      </div>
    );
  }
}

export default RequestsTest;
