import React from "react";
import { Element } from "react-scroll";

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
        }
      } catch (error) {}

      return (
        <Element id={item} className="menu-item">
          <div className="menu-description">
            <div id="menu-title">
              <b>{item.name}</b>
            </div>
            {item.description}
            <br></br>
            <br></br>
            <b>{item.displayPrice}</b>
          </div>
          <div className="menu-img-wrapper">
            <img
              id="menu-img"
              src={imageUrl}
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
