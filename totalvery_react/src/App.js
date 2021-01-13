import React from 'react';
import TopBar from './TopBar';
import MainHome from './MainHome';
import AddressSearch from './AddressSearch';
import ShowResult from './ShowResult';
import GoogleApi from './GoogleApi'
import RequestsTest from './RequestsTest'
import "./App.css";
import { BrowserRouter, Route, Switch } from 'react-router-dom';



function App() {
  return(
    <div className="app">
      <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={MainHome} exact/>
             <Route path="/search" component={AddressSearch}/>
             <Route path="/result" component={ShowResult}/>
             <Route path="/googleApi" component={GoogleApi}/>
             <Route path="/requestsTest" component={RequestsTest}/>
           </Switch>
        </div> 
      </BrowserRouter>
    </div>
  )
}

export default App;