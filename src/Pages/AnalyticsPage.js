import React from "react";
import NavBar from "../Components/NavBar";

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
            <><NavBar></NavBar>
            <div className="AnalyticsPage">
                <div className="AnalyticsHeader">
                    <h1>Logged in as {this.state.username}</h1>
                    <button onClick={this.logOut} style={{ "color": "black" }}>Log out</button>
                </div>
                <div className="AnalyticsContainer">
                    
                </div>
            </div></>
        )
    }
};  
export default AnalyticsPage;