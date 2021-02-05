import React from 'react';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Login extends React.Component {
    render() {
        return (
            <div className="loginBackground">
                <div className="login">
                    {/* <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                        <div className="container">
                        <Link className="navbar-brand" to={"/sign-in"}>RemoteStack</Link>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to={"/sign-in"}>Sign in</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </nav> */}


                    <form>
                        <h3 className="loginTitle">LOGIN</h3>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" placeholder="Enter email" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Enter password" />
                        </div>

                        <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>
                        <p></p>
                        <p className="forgot-password text-right">
                            Forgot <a href="/findPassword">Password?</a>
                            
                        </p>

                        <p className="signup text-right">
                            Or <a href="/signup">Sign Up</a>
                        </p>
                    </form>
                </div>
            </div>
            
        )
    }
}

export default Login;