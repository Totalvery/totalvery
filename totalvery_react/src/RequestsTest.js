import React from "react";
import TopBar from "./TopBar";
import ImgTest from "./ImgTest";

class RequestsTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      address: null,
      priceRange: null,
    };
  }

  componentDidMount() {
    // this is an example for the request body
    const payload = {
      meta: { ubereats: "true", doordash: "true", grubhub: "true" },
      ids: {
        ubereatsID: "345b3c6f-8d4b-4990-94f5-d091e337ecec",
        doordashID: "855640",
        grubhubID: "2026708",
      },
      customer_location: { latitude: "37.7581925", longitude: "-122.4121704" },
    };

    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    fetch("http://127.0.0.1:8000/api/getStoreDetails/", requestOptions)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          title: data.title,
          address: data.location.address,
          priceRange: data.priceRange,
        })
      );
  }

  render() {
    return (
      <div>
        <TopBar />
        <ImgTest />
        <div className="store-detail">
          <h1 className="store-title">{this.state.title}</h1>
          <div className="priceRange">{this.state.priceRange}</div>
          <div className="address">{this.state.address}</div>
        </div>
      </div>
    );
  }
}

export default RequestsTest;
