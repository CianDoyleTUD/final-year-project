import { Link } from "react-router-dom";
import React from "react";


class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: "", loginButton: "" }
        this.logOut = this.logIn.bind(this);
    }

    logIn() {
        window.location = "http://localhost:3000/login";
    }

    componentDidMount() {
        const username = sessionStorage.getItem('username');
        this.setState({username: username})
        
        if(!username || username == "") {
            this.setState({loginButton: <button className="loginButton" onClick={this.logIn}>Log in</button>})
        }
        else {
            this.setState({loginButton: <span className="loginText">Logged in as {username}</span>})
            console.log("Doing login one")
            console.log(username)
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
                       {this.state.loginButton}
                    </ul>
                </nav>
            </div>
        );
    }
}
export default NavBar;