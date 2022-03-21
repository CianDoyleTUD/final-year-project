import '../App.css';
import React from 'react';

class TrackedWallets extends React.Component{

    constructor(props) {
        super(props);
        this.state = { showForm: false, name: "", address: "", username: "", trackedWallets: [], walletAdded: "", errorSpan: ""};
        this.showWalletForm = this.showWalletForm.bind(this);
        this.hideWalletForm = this.hideWalletForm.bind(this);
        this.removeWallet = this.removeWallet.bind(this);
        this.addWallet = this.addWallet.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.fetchTrackedWallets();
    }

    async fetchTrackedWallets() {
        const username = sessionStorage.getItem('username');
        fetch("http://localhost:3001/api/trackedwallets/" + username)
            .then(res => res.json())
            .then(res => this.setState({trackedWallets: res['tracked_wallets']}))
    }

    async trackNewWallet() {
        const username = sessionStorage.getItem('username');
        const wallet = this.state.address;
        const name = this.state.name;

        const fetchData = {
            method: "POST",
            mode: 'cors',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({username: username, wallet: wallet, name: name})
        }
        fetch("http://localhost:3001/addwallet/", fetchData)
            .then(res => res.json())
            .then(res => this.setState({walletAdded: res['walletAdded']}))
    }

    async removeTrackedWallet(event) {
        console.log(event.target.value)
        const username = sessionStorage.getItem('username');
        const wallet = event.target.value;

        const fetchData = {
            method: "POST",
            mode: 'cors',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({username: username, wallet: wallet})
        }

        fetch("http://localhost:3001/removewallet/", fetchData)
            .then(res => res.json())
            .then(res => this.setState({walletAdded: res['walletAdded']}))
    }

    handleChange(event) {  
        if(event.target.id == "address")
            this.setState({address: event.target.value});  
        else
            this.setState({name: event.target.value});  
    }

    addWallet(event) {
        if (this.state.address == "" || this.state.name === "") {
            this.setState({errorSpan: <span style={{"color": "red", "margin": "1em"}}>Both fields are required</span>})
        }
        else {
            this.trackNewWallet();
            this.hideWalletForm();
            window.location.reload(false);
        }
        event.preventDefault()
    }

    removeWallet(event) {
        this.removeTrackedWallet(event);
        window.location.reload(false);
        event.preventDefault()
    }

    showWalletForm() {
        this.setState({showForm: true})
    }

    hideWalletForm() {
        this.setState({showForm: false})
    }

    render(){
        return (
            <><div className="WalletsContainer">
                <div className='WalletsHeader'>
                    <h1>Wallet tracking</h1>
                    <button onClick={this.showWalletForm}>+</button>
                </div>
                <div className="WalletsBody">
                    {this.state.trackedWallets.map((wallet, i) => {
                        return (
                            <div className='TrackedWalletContainer'>
                                <span>{wallet.wallet}</span>
                                <span>{wallet.name}</span>
                                <a href={'http://localhost:3000/address/' + wallet.wallet}>View wallet details</a>
                                <button className='XButton' type="button" value={wallet.wallet} onClick={this.removeWallet}>X</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='newWalletForm'>
                {this.state.showForm ? 
                    <form action="" onSubmit={this.addWallet}>
                        <h1>Track new wallet</h1>
                        <span>Wallet address</span>
                        <input className="newWalletInput" required id="address" type="text" placeholder="Address" value={this.state.address} onChange={this.handleChange} />
                        <span>New name</span>
                        <input className="newWalletInput" required id="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange} />
                        <button className="submitButton" type="button" onClick={this.addWallet}>Track wallet</button>
                    </form> 
                : null }
                <div className='errorContainer'>
                    {this.state.errorSpan}
                </div>
            </div></>
        )
    }
  
}

export default TrackedWallets;
