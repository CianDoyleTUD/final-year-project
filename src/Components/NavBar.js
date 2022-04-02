import { Link } from "react-router-dom";
import React from "react";


class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: "", loginButton: "", accountButton: "", signOutButton: "" }
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.openAccountPage = this.openAccountPage.bind(this);
    }

    logIn() {
        window.location = "http://localhost:3000/login";
    }

    logOut() {
        sessionStorage.setItem('username', "");
        this.setState({username: ""})
        window.location = "http://localhost:3000/";
    }

    openAccountPage() {
        window.location = "http://localhost:3000/account";
    }

    componentDidMount() {
        const username = sessionStorage.getItem('username');
        this.setState({username: username})
        
        if(!username || username == "") {
            this.setState({
                loginButton: <button className="loginButton" onClick={this.logIn}>Log in</button>,
                accountButton: "",
                signOutButton: "",
            })
        }
        else {
            this.setState({
                loginButton: <button className="loginButton">Logged in as {username}</button>,
                accountButton:<a href='http://localhost:3000/account'>Account</a>,
                signOutButton:<a href='#' onClick={this.logOut} style={{"color": "red"}}>Sign out</a>,
            })
        }
    }

    render() {
        return (
            <div className="NavBar">
                <nav>
                    <ul>
                        <Link to="/">
                            <li>
                                Home
                            </li>
                        </Link>
                        <Link to="/analytics">
                            <li>
                                Analytics
                            </li>
                        </Link>
                        <div className="loginButtonContainer">
                            {this.state.loginButton}
                            <div className="AccountDropdown">
                                {this.state.accountButton}
                                {this.state.signOutButton}
                            </div>
                        </div>
                    </ul>
                </nav>
            </div>
        );
    }
}
export default NavBar;