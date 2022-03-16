import React from "react";

class Transaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { blockReward: 0.0, walletCount: 0 }
    }

    componentDidMount() {
        if(!this.props.data.inputs)
            this.getBlockReward();
    }

    getBlockReward() {
        let outputs = this.props.data.outputs.length;
        let total = 0.0;
        for(let i = 0; i < outputs; i++){
            total += this.props.data.outputs[i]['value'];
        }   
        this.setState({blockReward: total, walletCount: outputs})
    }
    
    render() {
        if (!this.props.data) {
            return <div />
        }
        if (!this.props.data.inputs) { // Coinbase transaction
            return (
                <div className="Transaction">
                    <div className="TransactionID">
                        <a>View full transaction</a>
                    </div>
                    <div className="TransactionData">
                        <div className="TransactionInputs">
                            <span style={{'line-height': '4em'}}>The block reward for this block was <span style={{color: '#74b9ff'}}>{this.state.blockReward} BTC</span> was sent to {this.state.walletCount} wallet(s).</span>
                        </div>
                        <p><span>&#8594;</span></p>
                        <div className="TransactionOutputs">
                            <p>Outputs</p>
                            <div className="TransactionWallets">
                                {this.props.data.outputs.map((tx,i) => <><a className="noOverflow" style={{'text-align': 'left'}} href={'../address/' + tx.to}>{tx.to}</a><span style={{'text-align': 'right'}} className="TransactionValuePositive"> (+{tx.value} BTC)</span><br/></>)}
                            </div>
                        </div>  
                    </div>
                </div>
            )
        }
        else { // Regular transaction
            return (
                <div className="Transaction">
                    <div className="TransactionID">
                        <a>View full transaction</a>
                    </div>
                    <div className="TransactionData">
                        <div className="TransactionInputs">
                            <p>Inputs</p>
                            <div className="TransactionWallets">
                                {this.props.data.inputs.map((tx,i) => <><a className="noOverflow" style={{'text-align': 'left'}} href={'../address/' + tx.from}>{tx.from}</a><span style={{'text-align': 'right'}} className="TransactionValueNegative"> (-{tx.value} BTC)</span></>)}
                            </div>
                        </div>
                        <p><span>&#8594;</span></p>
                        <div className="TransactionOutputs">
                            <p>Outputs</p>
                            <div className="TransactionWallets">
                                {this.props.data.outputs.map((tx,i) => <><a className="noOverflow" style={{'text-align': 'left'}} href={'../address/' + tx.to}>{tx.to}</a><span style={{'text-align': 'right'}} className="TransactionValuePositive"> (+{tx.value} BTC)</span></>)}
                            </div>
                        </div>  
                    </div>
                </div>
            )
        }
    };
};  
export default Transaction;