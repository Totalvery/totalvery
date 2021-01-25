import React from "react";
import MainHome from "./MainHome";
import TopBar from "./TopBar";
import AddressSearch from "./AddressSearch";
import ShowResult from "./ShowResult";
import GoogleApi from "./GoogleApi";
import RequestsTest from "./RequestsTest";
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
