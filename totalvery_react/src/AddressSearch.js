import React from "react";
import TextField from "./TextField";

function AddressSearch() {
    return(
        <div className="addresssearch">
            <view style={{position: 'absolute', top: 100, justifyContent:"center", alignItems:"center"}}>
                <TextField />
            </view>
            <text style={{position: 'relative', top: 600, right:300}}>Restsaurants near you:</text>
        </div>
    )
}

export default AddressSearch;