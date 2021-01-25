import React from "react";
import {Grid, GridList, GridListTile, GridListTileBar} from "@material-ui/core";

class AllRestaurants extends React.Component {
    render() {
        var json = this.props.items;

        return(
            <div className="allRestaurants">
                {/* <GridList cellHeight={220} cols={3}>
                    {restaurantData.map((data) => (
                        <GridListTile key={data.restaurant}>
                            <GridListTileBar title={data.restaurant} subtitle={data.rate}></GridListTileBar>
                        </GridListTile>
                    ))}
                </GridList> */}

                <GridList cellHeight={250} cols={3}>
                    {this.props.list.map((name) => (
                        <GridListTile key={name}>
                            {/* <img src={name}/> */}
                            <GridListTileBar title={name} subtitle={name} style={{fontFamily:"Maplestory"}}></GridListTileBar>
                        </GridListTile>
                    ))}
                </GridList>

            
                {this.props.names}
                {json}
            </div>
            
        )
    }
}

export default AllRestaurants;