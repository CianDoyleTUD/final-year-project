import React from 'react';

class AddressTransaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { date: "", value: 0, transactionType: "" }
    }

    // Format the timestamp to human-readable
    calculateTransactionDetails() {
        let formattedTime = new Date(this.props.data.timestamp);
        this.setState({date: formattedTime.getHours() + formattedTime.getDate() + "/" + formattedTime.getMonth() + "/" + formattedTime.getFullYear()})
        console.log(formattedTime)
    }

    componentDidMount() {
        this.calculateTransactionDetails();
        if (this.props.data.type == 'Spent'){
            this.setState({transactionType: <span className='TransactionValueNegative'>${this.state.value}</span>})
        }
        else {
            this.setState({transactionType: <span className='TransactionValuePositive'>${this.state.value}</span>})
        }
    }
    
    render() {
        return (
            <div className="AddressTransaction">
                <span className='AddressTransactionHash'>0xdf98hfh39d839d3hddawdddwad</span>
                <div className='AddressTransactionHeader'>
                    <span>{this.props.data.type}</span>
                    <span>Value</span>
                    <span>Date</span>
                </div>
                <div className='AddressTransactionBody'>
                    <span>{this.props.data.amount} BTC</span>
                    {this.state.transactionType}
                    <span>{this.state.date}</span>
                </div>
            </div>
        )
    };
};  
export default AddressTransaction;