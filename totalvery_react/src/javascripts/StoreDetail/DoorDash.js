import React from "react";
import DoorDashMenu from "./DoorDashMenu";

import "../../App.css";

class DoorDash extends React.Component {
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
      sectionEntitiesMap: this.props.json_data.menu.doordash,
    });

    console.log("this.state.json_data: " + this.state.json_data);
  }

  render() {
    console.log(this.state.json_data);
    // const menu = this.state.subNav.map((each) => <Menu subNav={each} />);
    // console.log("menu: " + menu);
    // menu.forEach((item, i) => {
    //   console.log(item);
    // });

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
            {this.state.sectionEntitiesMap.map((each) => (
              <DoorDashMenu sectionEntitiesMap={each} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default DoorDash;
