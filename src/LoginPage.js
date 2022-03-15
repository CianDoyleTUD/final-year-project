import React from "react";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {validCredentials: false, errorMessage: "", username: "", password: ""};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(event) {
        this.sendLoginData().then(() => {
            console.log("hii")
            console.log(this.state.validCredentials)
        });
        event.preventDefault()
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="LoginPage">
                <div className="LoginContainer">
                    <form action="" onSubmit={this.handleSubmit}>
                        <div className="loginInputContainer">
                            {this.state.errorMessage}
                            <input className="loginInput" id="username" type="text" placeholder="Username / Email" value={this.state.username} onChange={this.handleChange}/>
                            <input className="loginInput" id="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
                        </div>
                        <div className="submitButtonContainer">
                            <button className="submitButton" type="button"  onClick={this.handleSubmit} >Login</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
};  
export default LoginPage;