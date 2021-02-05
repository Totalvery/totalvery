import React from "react";
import { Link } from "react-router-dom";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import no_image from "../images/no-image.png";

class AllRestaurants extends React.Component {
  render() {
    function RatingNull(props) {
      const ratingNum = props.ratingNum;
      if (ratingNum === 0) {
        return "Newly Added";
      }
      return "Rating: " + ratingNum;
    }
    console.log("allRestaurants props: " + this.props);

    return (
      <div className="allRestaurants">
        <GridList cellHeight={300} spacing={14} cols={3}>
          {JSON.parse(this.props.items).data.map((d) => (
            <GridListTile key={d.name}>
              <img src={d.data.image ? d.data.image : no_image} />
              <Link
                to={{
                  pathname: "/requestsTest/",
                  state: {
                    platform: d.data.platform,
                  },
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

export default AllRestaurants;
