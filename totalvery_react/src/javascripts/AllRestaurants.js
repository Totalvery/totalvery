import React from "react";
import { Link } from "react-router-dom";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import no_image from "../images/no-image.png";

import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class AllRestaurants extends React.Component {
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
    };
  }
  // componentDidMount(props) {
  //   const { cookies } = this.props;
  //   this.setState({
  //     locCookie: cookies.get("tv.loc") || "",
  //     ddOffer: cookies.get("dd.offer") || "",
  //   });
  //   cookies.set(
  //     "dd.offer",
  //     JSON.stringify(this.props.items.DoordashOffer),
  //     {
  //       path: "/",
  //     }
  //   );
  // }

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
      <div className="allRestaurants">
        <GridList cellHeight={300} spacing={14} cols={3}>
          {items.data.map((d) => (
            <GridListTile key={d.name}>
              <img src={d.data.image ? d.data.image : no_image} />
              <Link
                to={{
                  pathname: "/store/",
                }}
                target="_blank"
                onClick={() => {
                  cookies.set("tv.store", JSON.stringify(d.data.platform), {
                    path: "/",
                  });
                  if (d.data.platform[0].doordash.support === true) {
                    let id = d.data.platform[0].doordash.id;
                    console.log("items.DoordashOffer");
                    console.log(items);
                    if (Object.keys(items.DoordashOffer.data).includes(id)) {
                      offerCookie = items.DoordashOffer.data[id];
                    }
                    console.log("offerCookie");
                    console.log(offerCookie);
                    // offerCookie = items.DoordashOffer.data[id];
                    cookies.set("dd.offer", JSON.stringify(offerCookie), {
                      path: "/",
                    });
                  }
                  cookies.set("dd.offer", JSON.stringify(offerCookie), {
                    path: "/",
                  });
                }}
              >
                <GridListTileBar
                  title={d.name}
                  subtitle={<RatingNull ratingNum={d.data.rating} />}
                  style={{ fontFamily: "Maplestory" }}
                ></GridListTileBar>
              </Link>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default withCookies(AllRestaurants);
