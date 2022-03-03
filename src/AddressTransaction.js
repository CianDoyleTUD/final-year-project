import React from 'react';

class AddressTransaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { date: "", value: 0, transactionType: "" }
    }

    // Format the timestamp to human-readable
    calculateTransactionDetails() {
        let formattedTime = new Date(this.props.data.timestamp);
        let month = formattedTime.getMonth()
        let day = formattedTime.getDate()
        let formattedMonth = (month < 10) ? '0'+month : month;
        let formattedDay = (day < 10) ? '0'+day : day;
        this.setState({date: formattedTime.getFullYear() + "-" + formattedMonth + "-" + formattedDay})
    }

    async fetchHistoricalPriceData() {
        await this.calculateTransactionDetails()
        fetch("http://localhost:3001/api/price/" + this.state.date)
            .then(res => res.json())
            .then(res => this.setState({value: Math.round((res['price'] * this.props.data.amount) * 100) / 100}))
            .then(() => {
                if (this.props.data.type == 'Spent'){
                    this.setState({transactionType: <span className='TransactionValueNegative'>${this.state.value}</span>})
                }
                else {
                    this.setState({transactionType: <span className='TransactionValuePositive'>${this.state.value}</span>})
                }
            });
    }

    componentDidMount() {
        this.fetchHistoricalPriceData();
        console.log(this.props.data)
    }
    
    render() {
        return (
            <div className="AddressTransaction">
                <div className='AddressTransactionHeader'>
                    <span>{this.props.data.type}</span>
                    <span>Value</span>
                    <span>Date</span>
                    <span>Hash</span>
                </div>
                <div className='AddressTransactionBody'>
                    <span>{this.props.data.amount} BTC</span>
                    {this.state.transactionType}
                    <span>{this.state.date}</span>
                    <span>{this.props.data.txid}</span>
                </div>
            </div>
        )
    };
};  
export default AddressTransaction;