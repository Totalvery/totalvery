import React from "react";
import GoogleApi from './GoogleApi'
import logo from "../images/main_home.png";
import doordash from "../images/Doordash.png";
import grubhub from "../images/Grubhub.jpg";
import ubereats from "../images/UberEats.png";

function MainHome() {
    return(
        <div className="mainhome">
            <view style={{position: 'absolute', justifyContent:"center", alignItems:"center"}}>
                <img src = {logo} alt="Logo"/>
            </view>

            <view style={{position: 'absolute', top: 650, justifyContent:"center", alignItems:"center"}}>
                <GoogleApi />
            </view>
            <text style={{position:"relative", top:940, marginRight:10}}>Currently supporting:</text>
            <a href="https://www.doordash.com/" target='_blank' rel="noopener noreferrer">
                <img src = {doordash} alt="Doordash" className="doordash" style={{position:"relative", top:900, flex:2, padding:5}}/>
            </a>
            <a href="https://www.ubereats.com/" target='_blank' rel="noopener noreferrer">
                <img src = {ubereats} alt="UberEats" className="ubereats" style={{position:"relative", top:900, flex:2, padding:5}}/>
            </a>
            <a href="https://www.grubhub.com/" target='_blank' rel="noopener noreferrer">
                <img src = {grubhub} alt="Grubhub" className="grubhub" style={{position:"relative", top:900, flex:2, padding:5}}/>
            </a>
        </div>
    )
}

export default MainHome;