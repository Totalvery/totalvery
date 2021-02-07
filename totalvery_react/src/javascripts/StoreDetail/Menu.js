import React, { useState, Suspense } from "react";
import { Element, Link } from "react-scroll";

function CategoryElement({ items, fallback }) {
  if (!items || items.length === 0) {
    return fallback;
  } else {
    // return items.map((item) => {
    return (
      <div>
        <Element name={items.title} className="category-title">
          {items.title} <br></br>
        </Element>
      </div>
    );
    // });
  }
}

function MenuElement({ uuid, items, sectionEntitiesMap, fallback }) {
  if (!items || items.length === 0) {
    return fallback;
  } else {
    return items.map((item) => {
      var display = "inline-block";
      try {
        if (!sectionEntitiesMap[item].imageUrl) {
          display = "none";
        }
      } catch (error) {}
      let title = "",
        description = "",
        price = "",
        imgUrl = "";
      var elemDisplay = "inline-flex";
      try {
        // if (uuid != "") {
        let menuItem = sectionEntitiesMap[uuid][item];
        title = menuItem.title;
        description = menuItem.description;
        price = "$" + parseFloat(menuItem.price) / 100;
        imgUrl = menuItem.imageUrl;
        // } else {
        //   title = sectionEntitiesMap[item].title;
        //   description = sectionEntitiesMap[item].description;
        //   price = "$" + parseFloat(sectionEntitiesMap[item].price) / 100;
        //   imgUrl = sectionEntitiesMap[item].imageUrl;
        // }
      } catch (error) {
        elemDisplay = "none";
      }

      return (
        <Element
          id={item}
          className="menu-item"
          style={{ display: `${elemDisplay}` }}
        >
          <div className="menu-description">
            <div id="menu-title"><b>{title}</b></div>
            {description}
            <br></br>
            <br></br>
            <b>{price}</b>
          </div>
          <div className="menu-img-wrapper">
            <img
              id="menu-img"
              src={imgUrl}
              style={{
                display: `${display}`,
              }}
            />
          </div>
        </Element>
      );
    });
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subNav: [],
      sectionEntitiesMap: [],
    };
  }
  componentDidMount() {
    if (this.props.subNav) {
      this.setState({ subNav: this.props.subNav });
    }
    if (this.props.sectionEntitiesMap) {
      this.setState({ sectionEntitiesMap: this.props.sectionEntitiesMap });
    }
  }

  render() {
    return (
      <div className="menu-block">
        <CategoryElement items={this.props.subNav} fallback={"Loading..."} />
        <MenuElement
          uuid={this.props.subNav.uuid}
          items={this.props.subNav.items}
          sectionEntitiesMap={this.props.sectionEntitiesMap}
          fallback={"Loading..."}
        />
      </div>
    );
  }
}

export default Menu;
