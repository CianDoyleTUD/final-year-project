import Block from "../Components/Block";
import React from 'react';
import NavBar from "../Components/NavBar";
import TrackedWallets from "../Components/TrackedWallets";

class AccountPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { apiResponse: "" }
    }
    
    componentDidMount() {
        const username = sessionStorage.getItem('username');
        this.setState({username: username})
    }

    logOut() {
        sessionStorage.setItem('username', "");
        this.setState({username: ""})
    }

    render() {
        return (
            <><NavBar />
            <div className="AccountPage">  
                <div className="AccountHeader">
                    <h1>Welcome, {this.state.username}</h1>
                </div>
                <TrackedWallets/>
            </div>
            </>
        );
    }
}
export default AccountPage;       