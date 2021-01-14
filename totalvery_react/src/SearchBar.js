import React, { Component } from 'react';
import { withGoogleMap, withScriptjs	 } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import { Redirect } from 'react-router';
// import { GoogleMapsAPI } from './client-config';


class SearchBar extends Component{

	constructor( props ){
		super( props );
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: 0,
				lng: 0
			},
			location:'',
            redirectToReferrer:false
		}
	}

    handleValueChange=(e)=>{
        let nextState={};
        nextState[e.target.name]=e.target.value;
        this.setState(nextState)
    }
	/**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getCity = ( addressArray ) => {
		let city = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getArea = ( addressArray ) => {
		let area = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	};
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getState = ( addressArray ) => {
		let state = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	};

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = ( place ) => {
		console.log( 'plc', place );
		const address = place.formatted_address,
		      addressArray =  place.address_components,
		      city = this.getCity( addressArray ),
		      area = this.getArea( addressArray ),
		      state = this.getState( addressArray ),
		      latValue = place.geometry.location.lat(),
		      lngValue = place.geometry.location.lng();
		// Set these values in the state.
		this.setState({
			address: ( address ) ? address : '',
			area: ( area ) ? area : '',
			city: ( city ) ? city : '',
			state: ( state ) ? state : '',
			mapPosition: {
				lat: latValue,
				lng: lngValue
			},
		})
		//redirect to /search
		this.setState({
            redirectToReferrer:true})
    }
	


	render(){
		const redirectToReferrer = this.state.redirectToReferrer;
        if (redirectToReferrer) {
            return <Redirect to={{ pathname: '/search', state: {location:this.state.address} }} />
        }
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
						<Autocomplete
							style={{
								width: '420px',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
								marginBottom: '500px',
								fontSize:'20px'
							}}
							onPlaceSelected={ this.onPlaceSelected }
							types={[]}
							type="text"
							name="location"
						/>
						  
				)
			)
		);
		let map;
		map = 
					
					<AsyncMap
						googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAx1Gg-3sXLsPNcZ9GP8DGIAsGH7ck5Lvk&libraries=places&v=weekly`}
						loadingElement={
							<div style={{ height: `0%` }} />
						}
						containerElement={
							<div style={{ height: `0%` }} />
						}
						mapElement={
							<div style={{ height: `100%` }} />
						}
					/>
				
		return(
			map
		 )
	}
}
export default SearchBar
