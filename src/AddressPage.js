import React from 'react';
import AddressTransaction from './AddressTransaction';
import NavBar from './NavBar.js';
import { UNIXToDate } from './UtilFunctions';

class AddressPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { transactions: "", address: "", txcount: "", balance: "0.0000000", spent: "", received: "", csvFile: "", csvHref: "", displayReceived: true, displaySpent: true, txArray: [] }
    }
    
    componentDidMount() {
        this.fetchAddressData();
    }

    calculateDetails(res) {

        Number.prototype.round = function(places) { // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
            return +(Math.round(this + "e+" + places)  + "e-" + places);
        }

        this.setState({csvFile: "date,type,amount,value,hash\n"})

        var txout_count = res["spent"].length;
        var txin_count = res["received"].length;
        this.setState({txcount: txout_count + txin_count})
        var total_spent = 0.0;
        var total_received = 0.0;

        for (var i = 0; i < txin_count; i++) {
            this.setState({txArray: [...this.state.txArray, {"data": this.state.transactions["received"][i].tx[0], "type": "Received"}] } )
            let value = this.state.transactions["received"][i].tx[0].outputs[0].value;
            let time = UNIXToDate(this.state.transactions["received"][i].tx[0].time)
            this.setState({csvFile: this.state.csvFile + time + ",Received," + value + ",1000" + "\n"})
            total_received += value;
        }
        this.setState({received: total_received})

        for (var i = 0; i < txout_count; i++) {
            this.setState({txArray: [...this.state.txArray, {"data": this.state.transactions["spent"][i].tx[0],  "type": "Spent"}]})
            var value = this.state.transactions["spent"][i].tx[0].inputs[0].value;
            let time = UNIXToDate(this.state.transactions["spent"][i].tx[0].time)
            this.setState({csvFile: this.state.csvFile + time + ",Spent," + value + ",1000" + "\n"})
            total_spent += value;
        }
        this.setState({spent: total_spent})
        this.setState({balance: (total_received - total_spent).round(6)})
        this.setState({csvHref: 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.state.csvFile)}); // https://stackoverflow.com/questions/17564103/using-javascript-to-download-file
        console.log(this.state.txArray)

        let tempArray = this.state.txArray;

        for (var i = 0; i < this.state.txArray.length; i++) {
            tempArray.sort(function(a, b) { return a.data.time - b.data.time });
        }

        this.setState({txArray: tempArray})
    }

    toggleDisplay(field) {
        this.setState({field: !field})
        console.log(field)
        //this.setState(this.state);
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
    // TODO: GET VALUE IN CSV

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
                        <tr><td>Value</td><td>{this.state.value} BTC</td></tr>
                    </tbody>
                </table>
                <div className="TransactionTable"> 
                    <table>
                        <a href={this.state.csvHref} download="transaction_data">Download data</a><p></p>
                        <span>Show received</span><input type="checkbox" defaultChecked={this.state.displayReceived} onChange={() => this.setState({displayReceived: !this.state.displayReceived})}/>
                        <span>Show spent</span><input type="checkbox" defaultChecked={this.state.displaySpent} onChange={() => this.setState({displaySpent: !this.state.displaySpent})}/>
                        {/* {this.state.transactions["spent"].map((transaction, i) => {
                            return (
                                <AddressTransaction key={i} data={{ type: "Spent", amount: transaction.tx[0].inputs[0].value, timestamp: transaction.tx[0].time, txid: transaction.tx[0].txid }}></AddressTransaction>
                            );
                        })}
                        {this.state.transactions["received"].map((transaction, i) => {
                            return (
                                <AddressTransaction key={i} data={{ type: "Received", amount:transaction.tx[0].outputs[0].value, timestamp: transaction.tx[0].time, txid: transaction.tx[0].txid }}></AddressTransaction>
                            );
                        })} */}
                        {this.state.txArray.map((transaction, i) => {
                            if(transaction['type'] == "Received") {
                                if (this.state.displayReceived) {
                                    return (
                                        <AddressTransaction key={i} data={{ type: transaction['type'], amount: transaction.data.outputs[0].value, timestamp: transaction.data.time, txid: transaction.data.txid }}></AddressTransaction>
                                    );
                                }
                            }
                            else {
                                if (this.state.displaySpent) {
                                    return (
                                        <AddressTransaction key={i} data={{ type: transaction['type'], amount: transaction.data.inputs[0].value, timestamp: transaction.data.time, txid: transaction.data.txid }}></AddressTransaction>
                                    );
                                }
                            }
                        })
                        }
                    </table>
                </div>
            </div></>
        );
    }
}
export default AddressPage;