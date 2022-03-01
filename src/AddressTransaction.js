import React from 'react';

class AddressTransaction extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="AddressTransaction">
                <span>{this.props.data.type}</span>
                <span>{this.props.data.amount}</span>
                <span>{this.props.data.type}</span>
                <span>{this.props.data.type}</span>
            </div>
        )
    };
};  
export default AddressTransaction;