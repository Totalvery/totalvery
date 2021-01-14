import React from 'react';
import TopBar from './TopBar';
import MainHome from './MainHome';
import AddressSearch from './AddressSearch';
import ShowResult from './ShowResult';
import "./App.css";

function App() {
  return(
    <div className="app">
      <TopBar />

      <MainHome />
      
      {/* <AddressSearch /> */}

      {/* <ShowResult /> */}
    </div>
  )
}

export default App;