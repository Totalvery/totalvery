import React from "react";
import TopBar from "./TopBar";
import ImgTest from "./ImgTest";

import FeeInfo from "./StoreDetail/FeeInfo";

import UberEats from "./StoreDetail/UberEats";
import DoorDash from "./StoreDetail/DoorDash";
import GrubHub from "./StoreDetail/GrubHub";

import "./App.css";

class RequestsTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: [],
      representative: null,
      heroImageUrl: null,
      title: null,
      address: null,
      priceRange: null,
      promotion: [],
      fee: [],
      json_data: [],
      isOpen: [],
      subNav: [],
      sectionEntitiesMap: [],
      feeText: null,
      etaRange: null,
      rating: null,
    };
  }

  componentDidMount() {
    // this is an example for the request body
    const payload = {
      meta: { ubereats: "true", doordash: "false", grubhub: "false" },
      ids: {
        ubereatsID: "d076f100-8710-4e70-9571-e2432fcf1d0d",
        doordashID: "582935",
        grubhubID: "375913",
      },
      customer_location: {
        location: "3134 Del Monte Ave, El Cerrito",
        latitude: "37.89033",
        longitude: "-122.29354",
      },
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
          meta: data.meta,
          representative: data.representative,
          heroImageUrl: data.heroImageUrl,
          title: data.title,
          address: data.location.streetAddress,
          priceRange: data.priceRange,
          isOpen: data.isOpen,
          json_data: data,
          promotion: data.promotion,
          fee: data.fee,
          etaRange: data.etaRange,
          rating: data.rating,
        })
      );
  }

  render() {
    let header = null;
    if (this.state.heroImageUrl === "") {
      header = <div className="no-header-img"> </div>;
    } else {
      header = <ImgTest heroImageUrl={this.state.heroImageUrl} />;
    }
    console.log(this.state.json_data);

    console.log("this.state.isOpen: " + this.state.isOpen);

    var arr = [];

    for (const each in this.state.isOpen) {
      console.log(each);
      console.log(this.state.isOpen[each]);
      if (this.state.isOpen[each]) {
        arr.push(each);
      }
    }
    console.log("arrrr:" + arr);

    // var fees = "";
    // for (const each in this.state.isOpen) {
    //   console.log("each: " + this.state.isOpen.each);
    //   if (this.state.isOpen[each]) {
    //     fees = <FeeInfo fee={this.state.json_data.fee} isOpen={arr} />;
    //     break;
    //   } else {
    //     console.log("else");
    //   }
    //   fees = "Closed";
    // }

    let ubereats_fee = "";
    let doordash_fee = "";
    let grubhub_fee = "";

    let total_ubereats_fee = "";
    let ubereats_eta = "";
    let total_doordash_fee = "";
    let doordash_eta = "";
    let total_grubhub_fee = "";
    let grubhub_eta = "";

    if (!this.state.isOpen.ubereats) {
      ubereats_fee = "Unavailable";
      try {
        let orderWrappers = null;
        orderWrappers = document.getElementsByClassName("order-wrapper");
        orderWrappers[0].style.visibility = "hidden";
      } catch (error) {}
    } else {
      let total = 0;
      try {
        ubereats_fee +=
          "$" + this.state.fee.smallOrderFee.ubereats + " Small Order Fee ∙ ";
        total += this.state.fee.smallOrderFee.ubereats;
      } catch {
        ubereats_fee += "$0 Small Order Fee ∙ ";
      }
      try {
        ubereats_fee +=
          "$" + this.state.fee.deliveryFee.ubereats + " Delivery Fee ∙ ";
        total += this.state.fee.deliveryFee.ubereats;
      } catch {
        ubereats_fee += "$0 Delivery Fee ∙ ";
      }
      try {
        ubereats_fee +=
          "$" +
          this.state.fee.serviceFee.ubereats.toFixed(2) +
          " Service Fee ∙ ";
        total += this.state.fee.serviceFee.ubereats;
      } catch {
        ubereats_fee += "$0 Service Fee ∙ ";
      }
      try {
        ubereats_fee +=
          "$" +
          this.state.json_data.ubereats_ca_driver_benefits_fee.toFixed(2) +
          " CA Driver Benefits Fee ∙ ";
        total += this.state.fee.serviceFee.ubereats;
      } catch {
        ubereats_fee += "$0 Service Fee ∙ ";
      }
      total_ubereats_fee = "$" + total.toFixed(2) + " Total Estimated Fees";
      try {
        ubereats_eta =
          " ∙ " +
          this.state.etaRange.ubereats.min +
          "-" +
          this.state.etaRange.ubereats.max +
          " Min ∙ " +
          this.state.rating.ubereats.ratingValue;
      } catch {
        ubereats_eta =
          " ∙ " +
          this.state.etaRange.ubereats.min +
          "-" +
          this.state.etaRange.ubereats.max +
          " Min ∙ Newly Added";
      }
    }
    if (!this.state.isOpen.doordash) {
      doordash_fee = "Unavailable";
      try {
        let orderWrappers = null;
        orderWrappers = document.getElementsByClassName("order-wrapper");
        orderWrappers[1].style.visibility = "hidden";
      } catch (error) {}
    } else {
      let total = 0;
      try {
        doordash_fee +=
          "$" + this.state.fee.smallOrderFee.doordash + " Small Order Fee ∙ ";
        total += this.state.fee.smallOrderFee.doordash;
      } catch {
        doordash_fee += "$0 Delivery Fee ∙ ";
      }
      try {
        doordash_fee +=
          "$" + this.state.fee.deliveryFee.doordash + " Delivery Fee ∙ ";
        total += this.state.fee.deliveryFee.doordash;
      } catch {
        doordash_fee += "$0 Delivery Fee ∙ ";
      }
      try {
        doordash_fee +=
          "$" + this.state.fee.serviceFee.doordash + " Service Fee ∙ ";
        total += this.state.fee.serviceFee.doordash;
      } catch {
        doordash_fee += "$0 Service Fee ∙ ";
      }
      total_doordash_fee = "$" + total.toFixed(2) + " Total Estimated Fees";
      doordash_eta =
        " ∙ " +
        this.state.etaRange.doordash +
        " Min ∙ " +
        this.state.rating.doordash.ratingValue;
    }
    if (!this.state.isOpen.grubhub) {
      grubhub_fee = "Unavailable";
      try {
        let orderWrappers = null;
        orderWrappers = document.getElementsByClassName("order-wrapper");
        orderWrappers[2].style.visibility = "hidden";
      } catch (error) {}
    } else {
      let total = 0;
      try {
        grubhub_fee +=
          "$" + this.state.fee.smallOrderFee.grubhub + " Small Order Fee ∙ ";
        total += this.state.fee.smallOrderFee.grubhub;
      } catch {
        grubhub_fee += "$0 Small Order Fee ∙ ";
      }
      try {
        grubhub_fee +=
          "$" + this.state.fee.deliveryFee.grubhub + " Delivery Fee ∙ ";
        total += this.state.fee.deliveryFee.grubhub;
      } catch {
        grubhub_fee += "$0 Delivery Fee ∙ ";
      }
      try {
        grubhub_fee +=
          "$" +
          this.state.fee.serviceFee.grubhub.toFixed(2) +
          " Service Fee ∙ ";
        total += this.state.fee.serviceFee.grubhub;
      } catch {
        grubhub_fee += "$0 Service Fee ∙ ";
      }
      total_grubhub_fee = "$" + total.toFixed(2) + " Total Estimated Fees";
      grubhub_eta =
        " ∙ " +
        this.state.etaRange.grubhub +
        " Min ∙ " +
        this.state.rating.grubhub.ratingValue;
    }

    var menuApp = null;
    if (this.state.representative === "ubereats") {
      menuApp = <UberEats json_data={this.state.json_data} />;
    } else if (this.state.representative === "doordash") {
      menuApp = <DoorDash json_data={this.state.json_data} />;
    } else if (this.state.representative === "grubhub") {
      menuApp = <GrubHub json_data={this.state.json_data} />;
    }

    return (
      <div>
        <TopBar /> {header}{" "}
        <div className="store-detail">
          <h1 className="store-title"> {this.state.title} </h1>{" "}
          <div className="priceRange"> {this.state.priceRange} </div>{" "}
          <div className="address"> {this.state.address} </div>{" "}
        </div>{" "}
        <div className="fees-order-container">
          <div className="fees-wrapper">
            <div className="ubereats-fee-wrapper">
              UberEats☛ {ubereats_fee}{" "}
              <span id="total-fee"> {total_ubereats_fee} </span> {ubereats_eta}
            </div>{" "}
            <div className="doordash-fee-wrapper">
              DoorDash☛ {doordash_fee}{" "}
              <span id="total-fee"> {total_doordash_fee} </span> {doordash_eta}
            </div>{" "}
            <div className="grubhub-fee-wrapper">
              GrubHub☛ {grubhub_fee}{" "}
              <span id="total-fee"> {total_grubhub_fee} </span> {grubhub_eta}{" "}
            </div>
          </div>
          <div className="order-box">
            <div className="order-wrapper">
              <a href="https://www.ubereats.com/san-francisco/food-delivery/organic-meals-to-go/3bc8787b-35a5-4816-b683-68be0432e930">
                Order in UberEats{" "}
              </a>
            </div>
            <div className="order-wrapper">
              <a href="https://www.doordash.com/store/organic-meals-to-go-l-l-c--albany-582935/en-US">
                Order in DoorDash
              </a>
            </div>
            <div className="order-wrapper">
              <a href="https://www.grubhub.com/restaurant/organic-meals-to-go-902-masonic-ave-albany/375913">
                Order in GrubHub
              </a>
            </div>
          </div>
        </div>
        {menuApp}{" "}
      </div>
    );
  }
}

export default RequestsTest;
