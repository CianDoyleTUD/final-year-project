import React from "react";
import Analytics from "../Components/Analytics";
import NavBar from "../Components/NavBar";
import TrackedWallets from "../Components/TrackedWallets";

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

    fetchTrackedWallet() {

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
                </div>
                <TrackedWallets/>
            </div></>
        )
    }
};  
export default AnalyticsPage;