import React from "react";
import { Link } from "react-router-dom";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { Button } from "@material-ui/core";
import no_image from "../images/no-image.png";

import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
class FilterRestaurants extends React.Component {
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired,
    };
  
    constructor(props) {
      super(props);
      const { cookies } = props;
      this.state = {
        items: null,
        locCookie: cookies.get("tv.loc") || "",
        ddOffer: cookies.get("dd.offer") || "",
        filter:""
      };
    }
    
    fetchData(url, data) {
        fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then((res) => res.json())
        .then((json) => {
            this.setState({
            items: json,
            isLoaded: true,
            });
        });
    }
    toggleButton(filter){

    }
    render() {
      const { cookies } = this.props;
      let items = JSON.parse(this.props.items);
      let offerCookie = "";
  
      function RatingNull(props) {
        const ratingNum = props.ratingNum;
        if (ratingNum === 0) {
          return "Newly Added";
        }
        return "Rating: " + ratingNum;
      }
  
      return (
        <div className="filterRestaurants"  style={{ height: "500px", width: "850px" }}>
          <Button onClick={(filter) => this.toggleButton("sad")}>sad</Button>
        </div>
      );
    }
  }
  
  export default withCookies(FilterRestaurants);
  