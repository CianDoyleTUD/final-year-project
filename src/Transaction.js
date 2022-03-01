import React from "react";

class Transaction extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        if (!this.props.data) {
            return <div />
        }
        if (!this.props.data.inputs) { // Coinbase transaction
            return (
                <div className="Transaction">
                    <div className="TransactionID">
                        <h4>{this.props.data.txid}</h4>
                    </div>
                    <div className="TransactionData">
                        <div className="TransactionInputs">
                            <p>Coinbase</p>
                            {this.props.data.coinbase}
                        </div>
                        <div className="TransactionOutputs">
                            <p>Outputs</p>
                            {this.props.data.outputs.map((tx,i) => <><span key={i}>{tx.to}</span><span className="TransactionValuePositive"> (+{tx.value} BTC)</span><br/></>)}
                        </div>  
                    </div>
                </div>
            )
        }
        else { // Regular transaction
            return (
                <div className="Transaction">
                    <div className="TransactionID">
                        <h4>{this.props.data.txid}</h4>
                    </div>
                    <div className="TransactionData">
                        
                        <div className="TransactionInputs">
                            <p>Inputs</p>
                            {this.props.data.inputs.map((tx,i) => <><span key={i}>{tx.from}</span><span className="TransactionValueNegative"> (-{tx.value} BTC)</span><br/></>)}
                        </div>
                        <div className="TransactionOutputs">
                            <p>Outputs</p>
                            {this.props.data.outputs.map((tx,i) => <><span key={i}>{tx.to}</span><span className="TransactionValuePositive"> (+{tx.value} BTC)</span><br/></>)}
                        </div>  
                    </div>
                </div>
            )
        }
    };
};  
export default Transaction;