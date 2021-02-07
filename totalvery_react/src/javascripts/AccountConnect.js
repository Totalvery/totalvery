import React from 'react';
import doordash from "../images/Doordash_Icon.png";
import grubhub from "../images/Grubhub.jpg";
import ubereats from "../images/UberEats_Icon.png";
import Divider from "@material-ui/core/Divider"

class AccountConnect extends React.Component {
    render() {
        return (
            <div>
                <h3 className="accountConnect_title">Connect Your Accounts</h3>
                <Divider variant="middle" />
                <div className="accountConnect">
                    <form className="eachAccount">
                        <img src = {doordash} alt="Doordash" className="doordash" style={{ padding:5}}/>
                        <h1 style={{display:"inline", marginLeft:"2%"}}>DoorDash</h1>
                        <button className="connectButton" type="submit" className="btn btn-primary btn-outline btn-lg" style={{marginLeft:"36%"}}>Connect</button>
                    </form>
                </div>
                <div className="accountConnect">
                    <form className="eachAccount">
                        <img src = {ubereats} alt="UberEats" className="ubereats" style={{fpadding:5}}/>        
                        <h1 style={{display:"inline", marginLeft:"2%"}}>Uber Eats</h1> 
                        <button className="connectButton" type="submit" className="btn btn-primary btn-outline btn-lg" style={{marginLeft:"36%"}}>Connect</button>           
                    </form>
                </div>

                <div className="accountConnect">
                    <form className="eachAccount">
                        <img src = {grubhub} alt="Grubhub" className="grubhub" style={{padding:5}}/>
                        <h1 style={{display:"inline", marginLeft:"2%"}}>Grubhub</h1> 
                        <button className="connectButton" type="submit" className="btn btn-primary btn-outline btn-lg" style={{marginLeft:"39%"}}>Connect</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default AccountConnect;