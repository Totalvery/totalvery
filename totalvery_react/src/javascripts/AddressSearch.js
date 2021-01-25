import React from "react";
import GoogleApi from "../GoogleApi";
import GoogleMap from "./GoogleMap";
import AllRestaurants from "./AllRestaurants";

class AddressSearch extends React.Component {
  constructor(props) {
    super(props);
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
    };
    this.fetchData = this.fetchData.bind(this);
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
      });
  }
  componentDidMount(props) {
    this.setState({
      lat: parseFloat(this.props.match.params.lat),
      lng: parseFloat(this.props.match.params.lng),
      location: this.props.location.state.location,
    });
    const url = "http://127.0.0.1:8000/api/getFeed/";
    //const url = "https://totalvery.herokuapp.com/api/getFeed/";
    const data = {
      location: this.props.location.state.location,
      lat: parseFloat(this.props.match.params.lat),
      lon: parseFloat(this.props.match.params.lng),
    };
    this.fetchData(url, data);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ isLoaded: false });
    this.setState({
      lat: parseFloat(newProps.match.params.lat),
      lng: parseFloat(newProps.match.params.lng),
      location: newProps.location.state.location,
    });
    const url = "http://127.0.0.1:8000/api/getFeed/";
    //const url = "https://totalvery.herokuapp.com/api/getFeed/";
    const data = {
      location: newProps.location.state.location,
      lat: parseFloat(newProps.match.params.lat),
      lon: parseFloat(newProps.match.params.lng),
    };
    this.fetchData(url, data);
  }

  render() {
    var { isLoaded, items } = this.state;

    if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const list = JSON.parse(items).data.map(d =>
        <div>
          <a>
            <p>{d.data.rating}</p>
            {/* <p>{d.data.image}</p> */}
            <img src={d.data.image}/>
            <p>{d.name}</p>
            
            
          </a>
        </div>)


      const name_list = JSON.parse(items).data.map((d) => <li>{d.name}</li>);
      const rate_list = JSON.parse(items).data.map((d) => <li>{d.data.rating}</li>);
      const img_list = JSON.parse(items).data.map((d) => <li>{d.data.image}</li>);
      return (
        <div className="addresssearch">
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
          <GoogleMap lat={this.state.lat} lng={this.state.lng}/>
          <text
            style={{
              position: "absolute",
              top: 750,
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
              top: 830,
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            <AllRestaurants items={items} list={list} names={name_list} images={img_list} rates={rate_list}/>
            {/* {list} */}
            {/* {items} */}
          </div>
        </div>
      );
    }
  }
}

export default AddressSearch;