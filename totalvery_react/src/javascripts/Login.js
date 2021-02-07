import React from 'react';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Login extends React.Component {
    render() {
        return (
            <div>
                <div className="login">
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