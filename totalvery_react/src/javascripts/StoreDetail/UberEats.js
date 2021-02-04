import React from "react";
import TopBar from "../TopBar";
import ImgTest from "../ImgTest";
import CategNav from "./CategNav";
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

    var arr = [];
    if (categs) {
      Object.keys(categs).forEach(function (key) {
        arr.push({
          title: categs[key]["title"],
          id: key,
          items: categs[key]["itemUuids"],
        });
      });
    }

    this.setState({ subNav: arr });
  }

  render() {
    console.log(this.state.json_data);
    var fees = "";
    if (this.state.isOpen === false) {
      fees = "Closed";
    } else if (this.state.isOpen === true) {
      fees = "Opened";
    }

    const menu = this.state.subNav.map((each) => <Menu subNav={each} />);

    return (
      <div>
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

export default UberEats;
