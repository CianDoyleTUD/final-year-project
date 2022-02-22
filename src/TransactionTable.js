import React from "react";
import Transaction from "./Transaction";

class TransactionTable extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        if (!this.props.data) {
            return <div />
        }
        return (
            <div className="TransactionTable">
                {this.props.data.map((transaction, i) => <Transaction key={i} data={transaction}/>)}
            </div>
        )
    };
};  
export default TransactionTable;