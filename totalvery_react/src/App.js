import React from "react";
import MainHome from "./javascripts/MainHome";
import TopBar from "./javascripts/TopBar";
import AddressSearch from "./javascripts/AddressSearch";
import ShowResult from "./javascripts/ShowResult";
import GoogleApi from "./GoogleApi";
import RequestsTest from "./javascripts/RequestsTest";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <div>
          <TopBar />
          <Switch>
            <Route path="/" component={MainHome} exact />
            <Route path="/search/:lat/:lng" component={AddressSearch} />
            <Route path="/result" component={ShowResult} />
            <Route path="/googleApi" component={GoogleApi} />
            <Route path="/requestsTest" component={RequestsTest} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
