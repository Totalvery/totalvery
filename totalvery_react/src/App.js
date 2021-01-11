import React from 'react';
import TopBar from './TopBar';
import MainHome from './MainHome';
import AddressSearch from './AddressSearch';
import ShowResult from './ShowResult';
import "./App.css";

import RequestsTest from './RequestsTest'

function App() {
  return(
    <div className="app">
      <TopBar />

      {/* <MainHome /> */}
      
      {/* <AddressSearch /> */}

      {/* <ShowResult /> */}

      <RequestsTest />
    </div>
  )
}

export default App;