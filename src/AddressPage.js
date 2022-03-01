import React from 'react';
import AddressTransaction from './AddressTransaction';

class AddressPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { apiResponse: "", address: "", txcount: "", balance: "0.0000000", spent: "", received: "" }
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
            var value = this.state.apiResponse["received"][i].tx[0].outputs[0].value;
            total_received += value;
            console.log(value);
        }
        this.setState({received: total_received})

        for (var i = 0; i < txout_count; i++) {
            var value = this.state.apiResponse["spent"][i].tx[0].inputs[0].value;
            total_spent += value;
            console.log(value);
        }
        this.setState({spent: total_spent})

        this.setState({balance: (total_received - total_spent).round(6)})
    }

    fetchAddressData() {
        let query =  window.location.pathname.substring(9);
        this.setState({address: query})
        fetch("http://localhost:3001/api/address/" + query)
            .then(res => res.json())
            .then(res => { 
                this.setState({ apiResponse: res });
                this.calculateDetails(res)
            });
    };

    render() {
        if (!this.state.apiResponse) {
            return <p>Loading...</p>
        }
        return (
            <div className="AddressPage">
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
                    <AddressTransaction data={{type: "Received"}}></AddressTransaction>
                    {this.state.apiResponse["spent"].map((transaction, i) => 
                    {
                        return (
                            <><p key={i}>{transaction.tx[0].txid}</p>
                            <p>{transaction.tx[0].outputs[0].to}</p>
                            <p className='TransactionValueNegative'>{transaction.tx[0].inputs[0].value}</p></>
                        )
                    })}
                    {this.state.apiResponse["received"].map((transaction, i) => 
                    {
                        return (
                            <><p key={i}>{transaction.tx[0].txid}</p>
                            <p>{transaction.tx[0].outputs[0].to}</p>
                            <p className='TransactionValuePositive'>{transaction.tx[0].outputs[0].value}</p></>
                        )
                    })}
                </table>
            </div>
            </div>
        );
    }
}
export default AddressPage;