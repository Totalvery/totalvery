import React from "react";
import TextField from "./TextField";
import GoogleMap from "./GoogleMap";

function AddressSearch() {
    return(
        <div className="addresssearch">
            <view style={{position: 'absolute', top: 100, justifyContent:"center", alignItems:"center"}}>
                <TextField />
            </view>
            <GoogleMap />
            <text style={{position: 'absolute', top: 800, left:500, fontSize:25}}>Restsaurants near you:</text>
        </div>
    )
}

export default AddressSearch;