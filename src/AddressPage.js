import React from 'react';
import AddressTransaction from './AddressTransaction';
import NavBar from './NavBar.js';

class AddressPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { transactions: "", address: "", txcount: "", balance: "0.0000000", spent: "", received: "" }
    }
    
    componentDidMount() {
        this.fetchAddressData();
    }

    calculateDetails(res) {

        Number.prototype.round = function(places) { // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
            return +(Math.round(this + "e+" + places)  + "e-" + places);
        }

        var txout_count = res["spent"].length;
        var txin_count = res["received"].length;
        this.setState({txcount: txout_count + txin_count})
        var total_spent = 0.0;
        var total_received = 0.0;

        for (var i = 0; i < txin_count; i++) {
            var value = this.state.transactions["received"][i].tx[0].outputs[0].value;
            total_received += value;
        }
        this.setState({received: total_received})

        for (var i = 0; i < txout_count; i++) {
            var value = this.state.transactions["spent"][i].tx[0].inputs[0].value;
            total_spent += value;
        }
        this.setState({spent: total_spent})

        this.setState({balance: (total_received - total_spent).round(6)})
    }

    fetchAddressData() {
        let query = window.location.pathname.substring(9);
        this.setState({address: query})
        fetch("http://localhost:3001/api/address/" + query)
            .then(res => res.json())
            .then(res => { 
                this.setState({ transactions: res });
                this.calculateDetails(res)
            });
    };
    
    // TODO: GET THE CORRECT INPUT/OUTPUT IN CASES WHERE MULTIPLE I/Os

    render() {
        if (!this.state.transactions) {
            return <p>Loading...</p>
        }
        return (
            <><NavBar /><div className="AddressPage">
                <table>
                    <tbody className="AddressInfo">
                        <tr><td>Address</td><td>{this.state.address}</td></tr>
                        <tr><td>Number of transactions</td><td>{this.state.txcount}</td></tr>
                        <tr><td>Bitcoin received</td><td>{this.state.received} BTC</td></tr>
                        <tr><td>Bitcoin sent</td><td>{this.state.spent} BTC</td></tr>
                        <tr><td>Balance</td><td>{this.state.balance} BTC</td></tr>
                    </tbody>
                </table>
                <div className="TransactionTable"> 
                    <table>
                        {this.state.transactions["spent"].map((transaction, i) => {
                            return (
                                <AddressTransaction key={i} data={{ type: "Spent", amount: transaction.tx[0].inputs[0].value, timestamp: transaction.tx[0].time, txid: transaction.tx[0].txid }}></AddressTransaction>
                            );
                        })}
                        {this.state.transactions["received"].map((transaction, i) => {

                            return (
                                <AddressTransaction key={i} data={{ type: "Received", amount:transaction.tx[0].outputs[0].value, timestamp: transaction.tx[0].time, txid: transaction.tx[0].txid }}></AddressTransaction>
                            );
                        })}
                    </table>
                </div>
            </div></>
        );
    }
}
export default AddressPage;