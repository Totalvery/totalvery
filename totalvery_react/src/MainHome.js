import React from "react";
import TextField from "./TextField";
import logo from "./main_home.png";
import doordash from "./Doordash.png";
import grubhub from "./Grubhub.jpg";
import ubereats from "./UberEats.png";

function MainHome() {
    return(
        <div className="mainhome">
            <view style={{position: 'absolute', justifyContent:"center", alignItems:"center"}}>
                <img src = {logo} alt="Logo"/>
            </view>
            <view style={{position: 'absolute', top: 650, justifyContent:"center", alignItems:"center"}}>
                <TextField />
            </view>
            <text style={{position:"relative", top:940, marginRight:10}}>Currently supporting:</text>
            <view>
                <img src = {doordash} alt="Doordash" className="doordash" style={{position:"relative", top:900, flex:2, padding:5}}/>
            </view>
            <view>
                <img src = {ubereats} alt="UberEats" className="ubereats" style={{position:"relative", top:900, flex:2, padding:5}}/>
            </view>
            <view>
                <img src = {grubhub} alt="Grubhub" className="grubhub" style={{position:"relative", top:900, flex:2, padding:5}}/>
            </view>
        </div>
    )
}

export default MainHome;