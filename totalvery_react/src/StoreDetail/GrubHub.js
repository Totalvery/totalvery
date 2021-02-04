import React from "react";
import TopBar from "../TopBar";
import ImgTest from "../ImgTest";
import CategNav from "./CategNav";
import GrubHubMenu from "./GrubHubMenu";

import "../App.css";

class GrubHub extends React.Component {
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
      sectionEntitiesMap: this.props.json_data.menu.grubhub,
    });

    console.log("this.state.json_data: " + this.state.json_data);
  }

  render() {
    console.log(this.state.json_data);
    return (
      <div>
        <div className="menu-wrapper">
          <div className="menu-hour"></div>
          <div className="menu">
            {this.state.sectionEntitiesMap.map((each) => (
              <GrubHubMenu sectionEntitiesMap={each} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default GrubHub;
