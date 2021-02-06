import React from "react";
import TopBar from "./TopBar";
import ImgTest from "./ImgTest";

import UberEats from "./StoreDetail/UberEats";
import DoorDash from "./StoreDetail/DoorDash";
import GrubHub from "./StoreDetail/GrubHub";

import "../App.css";

import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

import ubereats_logo from "../images/ubereats_logo.png";
import grubhub_logo from "../images/grubhub_logo.png";
import doordash_logo from "../images/doordash_logo.png";

function UbereatsOffers({ items, fallback }) {
  if (!items || items.length === 0 || items == null) {
    return fallback;
  } else {
    return items.map((item) => {
      return (
        <div id="offer-block">
          <div id="logo-wrapper">
            <img id="logo" src={ubereats_logo}></img>
          </div>
          <div id="offer-description">{item.promoPillMessage.text}</div>
        </div>
      );
    });
  }
}

function DoordashOffers({ items, fallback }) {
  if (!items || items.length === 0 || items == "") {
    return fallback;
  } else {
    return items.map((item) => {
      return (
        <div id="offer-block">
          <div id="logo-wrapper">
            <img id="logo" src={doordash_logo}></img>
          </div>
          <div id="offer-description">{item.description}</div>
        </div>
      );
    });
  }
}

function GrubhubOffers({ items, fallback }) {
  if (!items || items.length === 0) {
    return fallback;
  } else {
    return items.map((item) => {
      let title = item.title;
      let descrp = item.description;
      if (descrp.startsWith("Offer valid for orders of ")) {
        const regexp = /\$[0-9]+(\.[0-9]{1,2})?/g;
        let money = (item.title + item.description).matchAll(regexp);
        title = "";
        descrp = "Spend " + money[1] + ", Save " + money[0];
      }
      return (
        <div id="offer-block">
          <div id="logo-wrapper">
            <img id="logo" src={grubhub_logo}></img>
          </div>
          <div id="offer-description">
            {title}
            <br></br>
            {descrp}
          </div>
        </div>
      );
    });
  }
}

class StoreDetail extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      isLoaded: false,
      meta: [],
      representative: null,
      heroImageUrl: null,
      title: null,
      location: null,
      priceRange: null,
      categories: "",
      promotion: [],
      fee: [],
      json_data: [],
      isOpen: [],
      offer: [],
      subNav: [],
      sectionEntitiesMap: [],
      feeText: null,
      etaRange: null,
      rating: null,
      locCookie: cookies.get("tv.loc") || "",
      storeCookie: cookies.get("tv.store") || "",
      ddCookie: cookies.get("dd.offer") || "",
      city: "",
    };
  }

  componentDidMount(props) {
    const payload = {
      meta: {
        ubereats: this.state.storeCookie[0].ubereats.support.toString(),
        doordash: this.state.storeCookie[0].doordash.support.toString(),
        grubhub: this.state.storeCookie[0].grubhub.support.toString(),
      },
      ids: {
        ubereatsID: this.state.storeCookie[0].ubereats.id || "0",
        doordashID: this.state.storeCookie[0].doordash.id || "0",
        grubhubID: this.state.storeCookie[0].grubhub.id || "0",
      },
      customer_location: {
        location: JSON.stringify(this.state.locCookie),
        latitude: this.state.locCookie.latitude.toString(),
        longitude: this.state.locCookie.longitude.toString(),
      },
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    console.log("requestOptions:" + requestOptions.body);
    fetch("http://127.0.0.1:8000/api/getStoreDetails/", requestOptions)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          isLoaded: true,
          meta: data.meta,
          representative: data.representative,
          heroImageUrl: data.heroImageUrl,
          title: data.title,
          priceRange: data.priceRange,
          categories: data.categories,
          isOpen: data.isOpen,
          offer: data.offer,
          json_data: data,
          promotion: data.promotion,
          fee: data.fee,
          etaRange: data.etaRange,
          rating: data.rating,
          location: data.location.streetAddress,
          city: data.location.city.replace(/\s+/g, "-").toLowerCase(),
        })
      );
  }

  render() {
    let ubereats_fee = "";
    let doordash_fee = "";
    let grubhub_fee = "";

    let total_ubereats_fee = "";
    let ubereats_eta = "";
    let total_doordash_fee = "";
    let doordash_eta = "";
    let total_grubhub_fee = "";
    let grubhub_eta = "";
    var { isLoaded } = this.state;

    let header = null;
    if (this.state.heroImageUrl === "") {
      header = <div className="no-header-img"> </div>;
    } else {
      header = <ImgTest heroImageUrl={this.state.heroImageUrl} />;
    }

    var arr = [];

    for (const each in this.state.isOpen) {
      console.log(each);
      console.log(this.state.isOpen[each]);
      if (this.state.isOpen[each]) {
        arr.push(each);
      }
    }

    if (!this.state.isOpen.ubereats) {
      ubereats_fee = "Unavailable";
      if (!isLoaded) {
        ubereats_fee = "Loading...";
      }
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
        total += this.state.json_data.ubereats_ca_driver_benefits_fee;
      } catch {}
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
      if (!isLoaded) {
        doordash_fee = "Loading...";
      }
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
          "$" +
          this.state.fee.serviceFee.doordash.toFixed(2) +
          " Service Fee ∙ ";
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
      if (!isLoaded) {
        grubhub_fee = "Loading...";
      }
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

    if (this.state.offer.length > 0) {
      // if (Object.keys(this.state.keys).includes("grubhub")) {
      console.log("grubhub offer 있음");
      // this.state.offer["grubhub"].forEach((each) => {
      //   offerBox = <Offer title={each.title} />;
      // });
      // // }
    }

    var menuApp = null;
    if (this.state.representative === "ubereats") {
      menuApp = <UberEats json_data={this.state.json_data} />;
    } else if (this.state.representative === "doordash") {
      menuApp = <DoorDash json_data={this.state.json_data} />;
    } else if (this.state.representative === "grubhub") {
      menuApp = <GrubHub json_data={this.state.json_data} />;
    }

    var ubereats_url =
      "https://www.ubereats.com/" +
      this.state.city +
      "/food-delivery/" +
      this.state.title +
      "/" +
      this.state.storeCookie[0].ubereats.id;

    var doordash_url =
      "https://www.doordash.com/store/" +
      this.state.storeCookie[0].doordash.id +
      "/en-US";

    var grubhub_url =
      "https://www.grubhub.com/restaurant/" +
      this.state.storeCookie[0].grubhub.id;

    let ddCookie = "";
    if (this.state.ddCookie) {
      ddCookie = this.state.ddCookie;
    }

    return (
      <div className="requestTest">
        <TopBar location={this.state.locCookie.address.eaterFormattedAddress} />{" "}
        {header}{" "}
        <div className="store-detail">
          <h1 className="store-title"> {this.state.title} </h1>{" "}
          <div className="priceRange">
            {" "}
            {this.state.priceRange} ・ {this.state.categories}
          </div>
          <div className="address">{this.state.location}</div>{" "}
        </div>
        <div className="fees-order-container">
          <div className="fees-wrapper">
            <div className="ubereats-fee-wrapper">
              UberEats ☛ {ubereats_fee}
              <span id="total-fee"> {total_ubereats_fee} </span> {ubereats_eta}
            </div>
            <div className="doordash-fee-wrapper">
              DoorDash ☛ {doordash_fee}
              <span id="total-fee"> {total_doordash_fee} </span> {doordash_eta}
            </div>
            <div className="grubhub-fee-wrapper">
              GrubHub ☛ {grubhub_fee}
              <span id="total-fee"> {total_grubhub_fee} </span> {grubhub_eta}
            </div>
          </div>
          <div className="order-box">
            <div className="order-wrapper">
              <a href={ubereats_url}>Order in UberEats </a>
            </div>
            <div className="order-wrapper">
              <a href={doordash_url}>Order in DoorDash</a>
            </div>
            <div className="order-wrapper">
              <a href={grubhub_url}>Order in GrubHub</a>
            </div>
          </div>
        </div>
        <div className="offer-wrapper">
          <UbereatsOffers items={this.state.offer.ubereats} fallback={""} />
          <DoordashOffers items={ddCookie} fallback={""} />
          <GrubhubOffers items={this.state.offer.grubhub} fallback={""} />
        </div>
        {menuApp}
      </div>
    );
  }
}
export default withCookies(StoreDetail);
