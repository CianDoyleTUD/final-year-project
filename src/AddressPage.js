import React from 'react';
import AddressTransaction from './AddressTransaction';
import NavBar from './NavBar.js';
import { downloadUrlAsFile, UNIXToDate } from './Utils/UtilFunctions';
import QRCode from "react-qr-code";

class AddressPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { transactions: "", address: "", txcount: "", balance: 0.0000000, value: 0.0, spent: "", received: "", csvFile: "", csvHref: "", displayReceived: true, displaySpent: true, txArray: [] }
    }
    
    componentDidMount() {
        this.fetchAddressData();
        //this.fetchPrice();
    }

    fetchPrice() {
       
    }

    calculateDetails(res) {

        Number.prototype.round = function(places) { // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
            return +(Math.round(this + "e+" + places)  + "e-" + places);
        }

        this.setState({csvFile: "date,type,amount,value,hash\n"})

        const txout_count = res["spent"].length;
        const txin_count = res["received"].length;
        this.setState({txcount: txout_count + txin_count})
        let total_spent = 0.0;
        let total_received = 0.0;

        for (var i = 0; i < txin_count; i++) {
            this.setState({txArray: [...this.state.txArray, {"data": this.state.transactions["received"][i].tx[0], "type": "Received"}] } )
            const value = this.state.transactions["received"][i].tx[0].outputs[0].value;
            const time = UNIXToDate(this.state.transactions["received"][i].tx[0].time)
            this.setState({csvFile: this.state.csvFile + time + ",Received," + value + ",1000" + "\n"})
            total_received += value;
        }
        this.setState({received: total_received})

        for (var i = 0; i < txout_count; i++) {
            this.setState({txArray: [...this.state.txArray, {"data": this.state.transactions["spent"][i].tx[0],  "type": "Spent"}]})
            const value = this.state.transactions["spent"][i].tx[0].inputs[0].value;
            const time = UNIXToDate(this.state.transactions["spent"][i].tx[0].time)
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

        const timestamp = Date.now();
        const query = UNIXToDate(timestamp)
        console.log(this.state.balance)
        fetch("http://localhost:3001/api/price/" + query)
            .then(res => res.json())
            .then(res => this.setState({value: (res['price'] * this.state.balance).round(2) }))
    }

    toggleDisplay(field) {
        this.setState({field: !field})
        console.log(field)
        //this.setState(this.state);
    }

    // Downloads QRCode as png https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
    downloadQRCode() {
        const canvas = document.getElementById("QRCode").outerHTML;
        const svgBlob = new Blob([canvas], {type:"image/svg+xml;charset=utf-8"});
        const svgUrl = URL.createObjectURL(svgBlob);
        downloadUrlAsFile(svgUrl, "QRCode.svg");
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
            <><NavBar />
            <div className="AddressPage">
                <div className='QRInfoContainer'>
                    <div className='QRContainer'>  
                        <h1>QRCode for this address</h1> 
                        <QRCode size={200} id="QRCode" className='QRCode' value="https://google.com"/>
                        <span>Want to download this QRCode to facilitate payments to your wallet? Click the download button below</span>             
                        <button ref={(element) => { this.nextButton = element; }} className="downloadButton" onClick={this.downloadQRCode.bind(this)}><span>Download SVG</span></button>
                    </div>
                    <div className="AddressTableContainer">
                        <div className='AddressInfoHeader'>
                            <h1>Address details</h1>
                        </div>
                        <div style={{"height": "100%"}} className='AddressTransactionBody'>
                            <table style={{"height": "100%"}}>
                                <thead></thead>
                                <tbody className="AddressInfo">
                                    <tr><td>Address</td><td>{this.state.address}</td></tr>
                                    <tr><td>Number of transactions</td><td>{this.state.txcount}</td></tr>
                                    <tr><td>Bitcoin received</td><td>{this.state.received} BTC</td></tr>
                                    <tr><td>Bitcoin sent</td><td>{this.state.spent} BTC</td></tr>
                                    <tr><td>Balance</td><td>{this.state.balance} BTC</td></tr>
                                    <tr><td>Value</td><td>${this.state.value}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="TransactionTable"> 
                    <table>
                        <a className='downloadTransactionButton' href={this.state.csvHref} download="transaction_data.csv">Download full transaction data</a><p></p>
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