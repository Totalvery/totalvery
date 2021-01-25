import React from "react";
import Navbar from "react-bootstrap"

function TopBar() {
    return(
        <div className="topbar" style={{color:"white"}}>
            <view>
                 {/* hyperlink this to Totalvery main page */}
                <text style={{fontWeight:"bold"}}>Totalvery</text>

                
            </view>
            <view style={{flex:.11}}>
                {/* hyperlink this to Totalvery login page */}
                {/* change this to user icon once logged in */}
                {/* <text>Login/Signup</text> */}
            </view>
        </div>
    )
}

export default TopBar;