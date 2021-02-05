import React from "react";
import { Element } from "react-scroll";

function AvailableElement({ items, fallback }) {
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
            <br></br>
            <b>${parseFloat(item.minimum_price_variation.amount) / 100}</b>
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

function CategoryElement({ items, fallback }) {
  if (!items || items.length === 0) {
    return fallback;
  } else {
    var elems = [];
    items.menu_item_list.map((item) => {
      if (item.available === true) {
        elems.push(item);
      }
    });
    if (elems.length > 0) {
      return (
        <div className="menu-block">
          <div>
            <Element name={items.name} className="category-title">
              {items.name} <br></br>
            </Element>
          </div>
          <AvailableElement
            items={elems}
            fallback="Loading..."
          ></AvailableElement>
        </div>
      );
    } else {
      console.log("elems.length 0 이다");
      return <div id="dummy">No Menu Available</div>;
    }
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
      <div>
        <CategoryElement
          items={this.props.sectionEntitiesMap}
          fallback={"Loading..."}
        />
      </div>
    );
  }
}

export default GrubHubMenu;
