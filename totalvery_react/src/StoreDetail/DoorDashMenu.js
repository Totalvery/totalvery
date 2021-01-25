import React, { useState, Suspense } from "react";
import { Element, Link } from "react-scroll";

function CategoryElement({ items, fallback }) {
  if (!items || items.length === 0) {
    return fallback;
  } else {
    // return items.map((item) => {
    return (
      <div>
        <Element name={items.name} className="category-title">
          {items.name} <br></br>
        </Element>
      </div>
    );
    // });
  }
}

function MenuElement({ items, fallback }) {
  if (!items || items.length === 0) {
    return fallback;
  } else {
    return items.map((item) => {
      const imageUrl = item.imageUrl;
      var display = "inline-block";
      try {
        if (!imageUrl) {
          display = "none";
          console.log(display);
        }
      } catch (error) {}

      return (
        <Element id={item} className="menu-item">
          <div className="menu-description">
            <b>{item.name}</b>
            <br></br>
            {item.description}
            <br></br>
            <b>{item.displayPrice}</b>
          </div>
          <div className="menu-img-wrapper">
            <img
              id="menu-img"
              src={imageUrl}
              style={{ width: "150px", height: "130px", display: `${display}` }}
            />
          </div>
        </Element>
      );
    });
  }
}

class DoorDashMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionEntitiesMap: [],
    };
  }
  componentDidMount() {
    if (this.props.sectionEntitiesMap) {
      this.setState({ sectionEntitiesMap: this.props.sectionEntitiesMap });
    }
  }

  render() {
    return (
      <div className="menu-block">
        <CategoryElement
          items={this.props.sectionEntitiesMap}
          fallback={"Loading..."}
        />
        <MenuElement
          items={this.props.sectionEntitiesMap.items}
          fallback={"Loading..."}
        />
      </div>
    );
  }
}

export default DoorDashMenu;
