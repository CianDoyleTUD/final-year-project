import React from "react";
import Graph from "../Components/Graph";
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
                </div>
                <div className="GraphContainer">
                    <Graph data={{type: 'price'}}></Graph>
                    <Graph data={{type: 'hash_rate'}}></Graph>
                    <Graph data={{type: 'transaction_count'}}></Graph>
                </div>
            </div></>
        )
    }
};  
export default AnalyticsPage;