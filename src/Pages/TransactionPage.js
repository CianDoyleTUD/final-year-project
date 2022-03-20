import React from "react";
import NavBar from "../Components/NavBar";
import Transaction from "../Components/Transaction";

const sampleData = {
    "txid": "3ed367c5ee21497b5395dcc11f53fded0c734e8a19a15f8bbc4f534a73506626",
    "inputs": [
        {
            "from": "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej",
            "value": 0.00546703
        }
    ],
    "outputs": [
        {
            "to": "149W1umCY8kdEzxM6WFwKZQ8janNvqH162",
            "value": 0.00187529
        },
        {
            "to": "3BTv48wd4jNLCX47tZX7SnhWUAXjXpNvoM",
            "value": 0.00118836
        },
        {
            "to": "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej",
            "value": 0.00200338
        }
    ]
}

class TransactionPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { txid: "" }
    }

    fetchBlockData() {
        let query =  window.location.pathname.substring(4);
        this.setState({txid: query})
        console.log(query)
    };

    componentDidMount() {
        this.fetchBlockData()
    }   



    render() {
        if (!this.state.txid) {
            return <div />
        }
        return (
            <><NavBar></NavBar>
            <div className="TransactionPage">
                <div className="TransactionContainer">
                    <Transaction data={sampleData}/>
                </div>
            </div></>
        )
    }
};  
export default TransactionPage;