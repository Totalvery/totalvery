import React from "react";
// import TextField from "./TextField";

import GoogleApi from './GoogleApi'

class AddressSearch extends React.Component {
    constructor(props){
        super(props);
        this.state={
            location:'',
            address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: 0,
				lng: 0
			},
            isLoaded:false,
            items:[],
        }
        this.fetchData = this.fetchData.bind(this)
    }

    fetchData(url,data){
       fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type':'application/json',
            }
        }).then(res=> res.json())
        .then(json=>{
            this.setState({
                items:json,
                isLoaded:true
            })
            
        });
    }
    componentDidMount(props) {
        if (this.props.location.state === undefined) {
          return;
        }
        else{
            this.setState({
                location:this.props.location.state.location
            }) 
            const url='http://127.0.0.1:8000/api/getFeed/'
            const data={
             'location':this.state.location
            }
            this.fetchData(url,data)
        }

    }

    render(){
        var { isLoaded,items }=this.state;
        if(!isLoaded){
            return <div>Loading...</div>
         }
       else{
        return(
            <div className="addresssearch">
                <view style={{position: 'absolute', top: 100, justifyContent:"center", alignItems:"center"}}>
                    <GoogleApi />
                </view>
                <text style={{position: 'relative', top: 200, right:300}}>Restsaurants near you: {this.state.location}</text>
            
                <div style={{position: 'relative', top: 300, right:300,justifyContent:"center", alignItems:"center"}}> 
                        <ul>
                            {items.map((item, index)=>(
                                <li key ={index}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    
                </div>
            
            
            </div>
        );
       }
       
        
    }
}

export default AddressSearch;