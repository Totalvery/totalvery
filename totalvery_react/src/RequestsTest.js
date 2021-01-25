import React from "react";
import TopBar from "./TopBar";
import ImgTest from "./ImgTest";
import CategNav from "./StoreDetail/CategNav";
import Menu from "./StoreDetail/Menu";

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
      meta: { ubereats: "true", doordash: "true", grubhub: "true" },
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
          sectionEntitiesMap: data.menu.ubereats.sectionEntitiesMap,
        })
      )
      .then((data) => {
        try {
          this.setState({
            sectionEntitiesMap: data.menu.ubereats.sectionEntitiesMap,
          });
        } catch (error) {
          console.log("There is no ubereats");
        }

        console.log("sectionEntitiesMap:" + this.state.sectionEntitiesMap);

        if (
          this.state.json_data.menu[this.state.representative].sections
            .length === 1
        ) {
        } else {
        }

        var categs = this.state.json_data.menu[this.state.representative]
          .subsectionsMap;

        var arr = [];
        if (categs) {
          console.log("enter");
          Object.keys(categs).forEach(function (key) {
            arr.push({
              title: categs[key]["title"],
              id: key,
              items: categs[key]["itemUuids"],
            });
          });
        }

        this.setState({ subNav: arr });
      });
    // var name = React.findDOMNode(this.refs.cpDev1).value;
    //71697a2e-cc09-4999-923f-4791161fbffa
    try {
      var name = document.getElementsByClassName("menu");
      console.log("name:" + name);
    } catch (error) {
      console.log("error");
    }
  }

  componentDidUpdate() {
    console.log("update");
  }

  render() {
    console.log(this.state.json_data);
    var fees = "";
    if (this.state.isOpen === false) {
      fees = "Closed";
    } else if (this.state.isOpen === true) {
      fees = "Opened";
    }

    console.log(this.state.subNav);

    const menu = this.state.subNav.map((each) => <Menu subNav={each} />);
    console.log("menu: " + menu);
    menu.forEach((item, i) => {
      console.log(item);
    });

    return (
      <div>
        <TopBar />
        <ImgTest heroImageUrl={this.state.heroImageUrl} />
        <div className="store-detail">
          <h1 className="store-title">{this.state.title}</h1>
          <div className="priceRange">{this.state.priceRange}</div>
          <div className="address">{this.state.address}</div>
        </div>
        <div className="fees-wrapper">{fees}</div>
        <div className="menu-wrapper">
          <div className="menu-hour"></div>
          {/* <div className="menu-top">
            {this.state.subNav.map((each) => (
              <CategNav subNav={each} />
            ))}
          </div> */}
          <div className="menu">
            {this.state.subNav.map((each) => (
              <Menu
                subNav={each}
                sectionEntitiesMap={this.state.sectionEntitiesMap}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default RequestsTest;
