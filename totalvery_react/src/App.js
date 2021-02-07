import React from "react";
import MainHome from "./javascripts/MainHome";
import TopBar from "./javascripts/TopBar";
import AddressSearch from "./javascripts/AddressSearch";
import GoogleApi from "./javascripts/GoogleApi";
import StoreDetail from "./javascripts/StoreDetail";
import ImgTest from "./javascripts/ImgTest";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountConnect from "./javascripts/AccountConnect";
import Login from "./javascripts/Login";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <div>
          <TopBar />
          <Switch>
            <Route path="/" component={MainHome} exact />
            <Route path="/search/:lat/:lng" component={AddressSearch} />

            <Route path="/googleApi" component={GoogleApi} />
            <Route path="/store" component={StoreDetail} />
            <Route path="/imgTest" component={ImgTest} />
            <Route path="/login" component={Login} />
            <Route path="/accountConnect" component={AccountConnect} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
