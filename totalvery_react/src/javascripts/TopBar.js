import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import marker_icon from "../images/marker_white.png";
import menu_icon_24 from "../images/menu_icon_24.png";
import menu_icon_48 from "../images/menu_icon_48.png";

class TopBar extends React.Component {
    render() {
        return(
            <div>
                <Navbar fixed="top" expand="lg" className="topbar">
                    <img
                        src={marker_icon}
                        width="20px"
                        height="30px"
                        alt="Location Marker"
                        height="10%"
                    />
                    <t className="topbar_location" style={{color:"white", fontFamily:'Philosopher'}}>{this.props.location}</t>
                    <Navbar.Brand className="totalvery_title" href="/" style={{color:"white", textAlign:"center", fontFamily:'Philosopher',  fontSize: "30px"}}>TOTALVERY</Navbar.Brand>
                    {/* <Navbar.Toggle aria-controls="bar_menu" /> */}
                    {/* <Navbar.Collapse id="bar_menu">
                        <Nav className="mr-auto">
                            <Nav.Link href="/" style={{color:"white"}}>Home</Nav.Link>
                            <Nav.Link href="/login" style={{color:"white"}}>Login</Nav.Link>
                            <Nav.Link href="/cart" style={{color:"white"}}>Cart</Nav.Link>
                        </Nav>
                    </Navbar.Collapse> */}

                    <Navbar.Brand className="topbar_login" href="/login" style={{color:"white", textAlign:"right", fontSize:"16px"}}>Login/SignUp</Navbar.Brand>
                </Navbar>
            </div>
        )
    }
}

export default TopBar;