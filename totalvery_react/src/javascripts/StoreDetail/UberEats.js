import React from "react";
import Menu from "./Menu";

import "../../App.css";

class UberEats extends React.Component {
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
    console.log("this.props.json_data" + this.props.json_data);
    this.setState({
      json_data: this.props.json_data,
      sectionEntitiesMap: this.props.json_data.menu.ubereats.sectionEntitiesMap,
    });

    var categs = this.props.json_data.menu.ubereats.subsectionsMap;
    var sections = this.props.json_data.menu.ubereats.sections;
    var onSaleMenu = [];
    let multipleMenu = false;
    if (sections.length > 1) {
      sections.forEach(function (d) {
        if (d.isOnSale === true) {
          let key = d.uuid;
          onSaleMenu[key] = d.subsectionUuids;
          multipleMenu = true;
          console.log("d");
          console.log(d);
        }
      });
    }

    var arr = [];
    var tmpArr = [];

    if (categs) {
      Object.keys(categs).forEach(function (categ) {
        if (multipleMenu === true) {
          for (var key in onSaleMenu) {
            console.log("onSaleMenu[key]");
            console.log(onSaleMenu[key]);
            if (onSaleMenu[key].includes(categ)) {
              console.log("key in onSaleMenu");
              tmpArr = categs[categ]["itemUuids"];
              arr.push({
                uuid: key,
                title: categs[categ]["title"],
                id: categ,
                items: tmpArr,
              });
            }
          }
        } else {
          for (var key in onSaleMenu) {
            tmpArr = categs[categ]["itemUuids"];
            arr.push({
              uuid: key,
              title: categs[categ]["title"],
              id: categ,
              items: tmpArr,
            });
          }
        }
      });
      console.log("ubereats arr:");
      console.log(arr);
    }

    this.setState({ subNav: arr });
  }

  render() {
    return (
      <div>
        <div className="menu-wrapper">
          <div className="menu-hour"></div>
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

export default UberEats;
