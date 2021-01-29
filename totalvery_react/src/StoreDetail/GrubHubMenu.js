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
      var imageUrl = null;
      var display = "none";
      try {
        imageUrl =
          item.media_image.base_url +
          item.media_image.public_id +
          "." +
          item.media_image.format;
        display = "inline-block";
      } catch (error) {}

      return (
        <Element id={item} className="menu-item">
          <div className="menu-description">
            <b>{item.name}</b>
            <br></br>
            {item.description}
            <br></br>
            <b>${parseFloat(item.price.amount) / 100}</b>
          </div>
          <div className="menu-img-wrapper">
            <img
              id="menu-img"
              src={imageUrl}
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

class GrubHubMenu extends React.Component {
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
          items={this.props.sectionEntitiesMap.menu_item_list}
          fallback={"Loading..."}
        />
      </div>
    );
  }
}

export default GrubHubMenu;
