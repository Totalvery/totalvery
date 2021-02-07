import React from "react";
import GoogleApi from "./GoogleApi";
import GoogleMap from "./GoogleMap";
import AllRestaurants from "./AllRestaurants";
import { Spinner } from "react-bootstrap";
import TopBar from "./TopBar";
import FilterRestaurants from "./FilterRestaurants.js";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Button } from "@material-ui/core";
class AddressSearch extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      location: "",
      address: "",
      city: "",
      area: "",
      state: "",
      lat: 0,
      lng: 0,
      isLoaded: false,
      items: null,
      locCookie: cookies.get("tv.loc") || "",
      ddOffer: cookies.get("dd.offer") || "",
      filter: "",
      filteredItems:null,
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleCateogry=this.handleCateogry.bind(this);
    this.handleAll=this.handleAll.bind(this);
  }

  fetchData(url, data) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
          this.setState({
            items: json,
            isLoaded: true,
          });
        }
      ) 
  }
  componentDidMount(props) {
    const { cookies } = this.props;
    this.setState({
      lat: parseFloat(this.props.match.params.lat),
      lng: parseFloat(this.props.match.params.lng),
      location: this.props.location.state.location,
      locCookie: cookies.get("tv.loc") || "",
      ddOffer: cookies.get("dd.offer") || "",
    });
    const url = "http://127.0.0.1:8000/api/getFeed/";
    //const url = "https://totalvery.herokuapp.com/api/getFeed/";
    const data = {
      location: JSON.stringify(this.state.locCookie),
      lat: parseFloat(this.state.lat),
      lon: parseFloat(this.state.lng),
    };
    this.fetchData(url, data);
  }

  componentWillReceiveProps(newProps) {
    const { cookies } = newProps;
    this.setState({ isLoaded: false });
    this.setState({
      lat: parseFloat(newProps.match.params.lat),
      lng: parseFloat(newProps.match.params.lng),
      location: newProps.location.state.location,
      locCookie: cookies.get("tv.loc") || "",
      ddOffer: cookies.get("dd.offer") || "",
    });
    const url = "http://127.0.0.1:8000/api/getFeed/";
    //const url = "https://totalvery.herokuapp.com/api/getFeed/";
    const data = {
      location: JSON.stringify(this.state.locCookie),
      lat: parseFloat(newProps.match.params.lat),
      lon: parseFloat(newProps.match.params.lng),
    };
    this.fetchData(url, data);
  }
  handleAll(){
    const url = "http://127.0.0.1:8000/api/getFeed/";
    const data = {
      location: JSON.stringify(this.state.locCookie),
      lat: parseFloat(this.state.lat),
      lon: parseFloat(this.state.lng),
    };
    this.fetchData(url, data);
  }
  handleCateogry(filter){
    const cat = filter
    const url ="http://127.0.0.1:8000/api/getFeedFilter/";
    const data={
      param:cat,
      lat:this.state.lat,
      lon:this.state.lng,
    }
    console.log(cat)
    this.fetchData(url,data);
  }
  render() {
    var { isLoaded, items } = this.state;
    console.log(items);

    if (!isLoaded) {
      return (
        <div>
          <Spinner
            animation="border"
            style={{ position: "fixed", top: "50%", left: "50%" }}
          ></Spinner>
          <h2
            style={{
              position: "fixed",
              top: "55%",
              left: "48%",
              fontFamily: "Philosopher",
            }}
          >
            Loading...
          </h2>
        </div>
      );
    } else {
      return (
        <div className="addresssearch">
          <div>
            <TopBar
              location={this.state.locCookie.address.eaterFormattedAddress}
            />
          </div>
          <view
            style={{
              position: "absolute",
              top: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GoogleApi />
           
          </view>
          <text
            style={{
              position: "absolute",
              top: 180,
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Exo",
            }}
          >
            Restaurants near you: {this.state.location}
          </text>
 
          <div
            style={{
              position: "absolute",
              top: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          <GoogleMap lat={this.state.lat} lng={this.state.lng} />
          </div>
       
          <text  style={{
              position: "absolute",
              top: 750,
              justifyContent:"left",
              fontSize: "20px",
              fontStyle:"italic",
              color:"grey",
              fontFamily: "Exo",
            }}
          >
            I am looking for something...
          </text>

          <div
            style={{
              position: "absolute",
              top: 770,
              justifyContent: "center",
              alignItems: "center",
  
            }}
          >
            <Button filter="Fast Food" onClick = {()=>this.handleCateogry("Fast Food")}  style={{fontSize: "30px",fontFamily:"Exo",margin:"20px",backgroundColor:"#fbc687"}}>Quick</Button>
            <Button filter="Local Eats" onClick = {()=>this.handleCateogry("Local Eats")}  style={{fontSize: "30px",fontFamily:"Exo",margin:"20px",backgroundColor:"#fbc687"}}>Local</Button>
            <Button filter="Healthy" onClick = {()=>this.handleCateogry("Healthy")}  style={{fontSize: "30px",fontFamily:"Exo",margin:"20px",backgroundColor:"#fbc687"}}>Healthy</Button>
            <Button filter="Desserts" onClick = {()=>this.handleCateogry("Dessert")}  style={{fontSize: "30px",fontFamily:"Exo",margin:"20px",backgroundColor:"#fbc687"}}>Sweet</Button>
            <Button filter="Vegan" onClick = {()=>this.handleCateogry("Vegan")}  style={{fontSize: "30px",fontFamily:"Exo",margin:"20px",backgroundColor:"#fbc687"}}>Vegan</Button>
            <Button filter="All" onClick = {this.handleAll} style={{fontSize: "30px",fontFamily:"Exo",margin:"20px",backgroundColor:"#fbc687"}}>Anything</Button>
      
        </div>

         
         

          <div
            style={{
              position: "absolute",
              top: 900,
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            {JSON.parse(items).data.length ? (
              <AllRestaurants items={items} />
            ) : (
              <p>Sorry, there are no restaurants available at the moment. </p>
            )}
          </div>
        </div>
      );
    }
  }
}

export default withCookies(AddressSearch);
