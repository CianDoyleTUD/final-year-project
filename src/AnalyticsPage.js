import React from "react";
import NavBar from "./NavBar";

class AnalyticsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: "" }
        this.logOut = this.logOut.bind(this);

    }

    logOut() {
        console.log("Logging out")
        sessionStorage.setItem('username', "");
        this.setState({username: ""})
    }

    componentDidMount() {
        const username = sessionStorage.getItem('username');
        this.setState({username: username})
    }

    render() {
        if(!sessionStorage.getItem('username')) {
            window.location = "http://localhost:3000/login";
        }
        return (
            <><NavBar></NavBar><div className="Test">
                <p>Logged in as {this.state.username}</p>
                <button onClick={this.logOut} style={{ "color": "black" }}>Log out</button>
            </div></>
        )
    }
};  
export default AnalyticsPage;