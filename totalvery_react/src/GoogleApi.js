import React, { Component } from 'react';
import SearchBar from './SearchBar';


class AddressSearch extends Component  {
    render(){
        return(
            <div className="googleApi">
                <SearchBar
                        google={this.props.google}
                    />
            </div>
        )
      }
    
}

export default AddressSearch;