import React, { Component } from 'react';
import TextField from "./TextField";
import SearchBar from './SearchBar';


class AddressSearch extends Component  {
    render(){
        return(
            <div className="addresssearch">
                {/* <view style={{position: 'absolute', top: 100, justifyContent:"center", alignItems:"center"}}>
                    <TextField />
                  </view>
                <text style={{position: 'relative', top: 600, right:300}}>Restsaurants near you:</text> */}
                <SearchBar
                        google={this.props.google}
                    />
            </div>
        )
      }
    
}

export default AddressSearch;