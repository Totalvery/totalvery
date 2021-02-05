import React from "react";
import MainHome from "./javascripts/MainHome";
import TopBar from "./javascripts/TopBar";
import AddressSearch from "./javascripts/AddressSearch";
import GoogleApi from "./javascripts/GoogleApi";
import RequestsTest from "./javascripts/RequestsTest";
import ImgTest from "./javascripts/ImgTest";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountConnect from "./javascripts/AccountConnect";

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
            <Route path="/requestsTest" component={RequestsTest} />
            <Route path="/imgTest" component={ImgTest} />
            <Route path="/accountConnect" component={AccountConnect} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
