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

function MenuElement({ items, sectionEntitiesMap, fallback }) {
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

      return (
        <Element id={item} className="menu-item">
          <div className="menu-description">
            <b>
              {item.title} {sectionEntitiesMap[item].title}
            </b>
            <br></br>
            {sectionEntitiesMap[item].description}
            <br></br><br></br>
            <b>${parseFloat(sectionEntitiesMap[item].price) / 100}</b>
          </div>
          <div className="menu-img-wrapper">
            <img
              id="menu-img"
              src={sectionEntitiesMap[item].imageUrl}
              style={{
                width: "200px",
                height: "200px",
                overflow: "hidden",
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
          items={this.props.subNav.items}
          sectionEntitiesMap={this.props.sectionEntitiesMap}
          fallback={"Loading..."}
        />
      </div>
    );
  }
}

export default Menu;
