import React, { useState } from "react";
import { Element, Link } from "react-scroll";

function List({ items, fallback }) {
  if (!items || items.length === 0) {
    return fallback;
  } else {
    // return items.map((item) => {
    return (
      <li>
        <Link
          activeClass="active"
          className="test1"
          to={items.title}
          spy={true}
          smooth={true}
          duration={500}
        >
          {items.title}
        </Link>
      </li>
    );
    // });
  }
}

class CategNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subNav: [],
    };
  }
  componentDidMount() {
    if (this.props.subNav) {
      this.setState({ subNav: this.props.subNav });
    }
  }

  render() {
    console.log("this.state.subNav: " + this.state.subNav);
    return (
      <div>
        <nav>
          <ul className="nav navbar-nav">
            <List items={this.props.subNav} fallback={"Loading..."} />
          </ul>
        </nav>
      </div>
    );
  }
}

export default CategNav;
