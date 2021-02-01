import React from "react";
import {GridList, GridListTile, GridListTileBar} from "@material-ui/core";
import no_image from "../images/no-image.png"

class AllRestaurants extends React.Component {
    render() {
        function ImageNull(props) {
            const imageLink = props.imageLink;
            if (imageLink==="") {
                return <img src={no_image} />;
            }
            return <img src={imageLink} />;
        }

        function RatingNull(props) {
            const ratingNum = props.ratingNum;
            if (ratingNum===0) {
                return "Rating: None";
            }
            return "Rating: "+ratingNum;
        }
        
        return(
            <div className="allRestaurants">
                <GridList cellHeight={300} spacing={14} cols={3}>
                    {JSON.parse(this.props.items).data.map((d) =>
                        <GridListTile key={d.name}>
                            <img src={d.data.image}/>
                            {/* <ImageNull imageLink={d.data.image} /> */}
                            <a href="/requestsTest">
                                <GridListTileBar title={d.name} subtitle={<RatingNull ratingNum={d.data.rating}/>} style={{fontFamily:"Maplestory"}} ></GridListTileBar>
                            </a>                            
                        </GridListTile>
                    )}
                </GridList>
                {/* {this.props.items} */}
            </div>
        )
    }
}

export default AllRestaurants;