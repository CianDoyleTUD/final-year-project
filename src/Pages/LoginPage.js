import React from "react";
import NavBar from "../Components/NavBar";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {validCredentials: false, errorMessage: "", username: "", password: ""};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    handleChange(event) {  
        if(event.target.id == "username")
            this.setState({username: event.target.value});  
        else
            this.setState({password: event.target.value});  
    }

    sendLoginData(data) {
        const fetchData = {
            method: "POST",
            mode: 'cors',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        }
        fetch("http://localhost:3001/login/", fetchData)
            .then(res => res.json())
            .then(res => {                   
                if(res['validCredentials']) {
                    this.setState({validCredentials: true}) 
                    sessionStorage.setItem('username', this.state.username);
                    window.location = "http://localhost:3000/analytics";
                }
                else {
                    this.setState({errorMessage: <p style={{"color": "red"}}>Invalid login credentials</p>}) 
                }
            }
            );
    };

    sendAccountData(data) {
        const fetchData = {
            method: "POST",
            mode: 'cors',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        }
        fetch("http://localhost:3001/createaccount/", fetchData)
            .then(res => res.json())
            .then(res => {                   
                if(res['status'] == "successful") {
                    this.setState({validCredentials: true}) 
                    sessionStorage.setItem('username', this.state.username);
                    window.location = "http://localhost:3000/analytics";
                }
                else {
                    this.setState({errorMessage: <p style={{"color": "red"}}>Username already exists!</p>}) 
                }
            }
            );
    };

    handleSubmit(event) {
        this.sendLoginData();
        event.preventDefault()
    }

    createAccount(event) {
        event.preventDefault()
        if(!this.state.password) {
            this.setState({errorMessage: <p style={{"color": "red"}}>Password must be more than 4 characters!</p>}) 
        }
        else {
            this.sendAccountData();
        }
    }

    render() {
        return (
            <><NavBar />
            <div className="LoginPage">
                <div className="LoginContainer">
                    <form action="" onSubmit={this.handleSubmit}>
                        <div className="loginInputContainer">
                            <h1 style={{ "color": "black", "margin": 0 }}>Log in</h1>
                            <h4 style={{ "color": "black", "margin": 0 }}>An account is required for some features</h4>
                            <input className="loginInput" id="username" type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} />
                            <input className="loginInput" id="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                            {this.state.errorMessage}
                        </div>
                        <div className="submitButtonContainer">
                            <button className="submitButton" type="button" onClick={this.handleSubmit}>Login</button>
                            <a href='#' onClick={this.createAccount} className="registerButton">Create new account</a>
                        </div>
                    </form>
                </div>
            </div></>
        )
    }
};  
export default LoginPage;