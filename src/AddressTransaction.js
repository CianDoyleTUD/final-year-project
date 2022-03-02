import React from 'react';

class AddressTransaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { date: "" }
    }

    // Format the timestamp to human-readable and calculate the USD values
    calculateTransactionDetails() {
        let formattedTime = new Date(this.props.data.timestamp);
        this.setState({date: formattedTime.getDate() + "/" + formattedTime.getMonth() + "/" + formattedTime.getFullYear()})
        console.log(formattedTime)
    }

    componentDidMount() {
        this.calculateTransactionDetails();
    }
    
    render() {
        return (
            <div className="AddressTransaction">
                <span>{this.props.data.type}</span>
                <span>{this.props.data.amount}</span>
                <span>{this.state.date}</span>
                <span>{this.props.data.value}</span>
            </div>
        )
    };
};  
export default AddressTransaction;