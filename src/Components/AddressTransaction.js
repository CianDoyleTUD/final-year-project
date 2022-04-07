import React from 'react';
import { UNIXToDate } from '../Utils/UtilFunctions';

class AddressTransaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { date: "", value: 0, transactionType: "", typeSign: "" }
    }
    
    async fetchHistoricalPriceData() {
        await this.setState({date: UNIXToDate(this.props.data.timestamp)})
        fetch("http://localhost:3001/api/price/" + this.state.date)
            .then(res => res.json())
            .then(res => {  
                this.setState({value: Math.round((res[0]['price'] * this.props.data.amount))})
            })
            .then(() => {
                if (this.props.data.type == 'Spent'){
                    this.setState({transactionType: <span className='TransactionValueNegative'>${this.state.value}</span>})
                    this.setState({typeSign: <span className='TransactionValueNegative'>(-) </span>})
                }
                else {
                    this.setState({transactionType: <span className='TransactionValuePositive'>${this.state.value}</span>})
                    this.setState({typeSign: <span className='TransactionValuePositive'>(+) </span>})
                }
            });
    }

    componentDidMount() {
        this.fetchHistoricalPriceData();
    }
    
    render() {
        return (
            <div type={this.props.data.type} className="AddressTransaction">
                <div className='AddressTransactionHeader'>
                    <span>{this.state.typeSign}{this.props.data.type}</span>
                    <span>Value</span>
                    <span>Date</span>
                    <span>Hash</span>
                </div>
                <div style={{"padding": "10px"}} className='AddressTransactionBody'>
                    <span>{this.props.data.amount} BTC</span>
                    {this.state.transactionType}
                    <span>{this.state.date}</span>
                    <a href={ 'http://localhost:3000/tr/' + this.props.data.txid } className='noOverflow'>{this.props.data.txid}</a>
                </div>
            </div>
        )
    };
};  
export default AddressTransaction;