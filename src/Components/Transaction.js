import React from "react";

class Transaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { blockReward: 0.0, walletCount: 0, trackedWallets: [], fetched: false}
    }

    componentDidMount() {
        console.log(this.props.data)
        if(!this.props.data.inputs)
            this.getBlockReward();

            const username = sessionStorage.getItem('username');
            if(username && username != "") {
                fetch("http://localhost:3001/api/trackedwallets/" + username)
                    .then(res => res.json())
                    .then(res => this.setState({trackedWallets: res['tracked_wallets'], fetched: true}))
            }
            else {
                this.setState({fetched: true})
            }
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
                        <a href={ 'http://localhost:3000/tr/' + this.props.data.txid }>View full transaction</a>
                    </div>
                    <div className="TransactionData">
                        <div className="TransactionInputs">
                            <span style={{'line-height': '4em'}}>The block reward for this block was <span style={{color: '#74b9ff'}}>{this.state.blockReward} BTC</span> was sent to {this.state.walletCount} wallet(s).</span>
                        </div>
                        <p><span>&#8594;</span></p>
                        <div className="TransactionOutputs">
                            <p>Outputs</p>
                            <div className="TransactionWallets">
                                {this.props.data.outputs.map((tx,i) => {
                                    return (
                                        <><a className="noOverflow" style={{ 'text-align': 'left' }} href={'../address/' + tx.to}>{tx.to}</a><span style={{ 'text-align': 'right' }} className="TransactionValuePositive"> (+{tx.value} BTC)</span><br /></>
                                    )
                                })}
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
                        <a href={ 'http://localhost:3000/tr/' + this.props.data.txid }>{this.props.data.txid}</a>
                    </div>
                    <div className="TransactionData">
                        <div className="TransactionInputs">
                            <p>Inputs</p>
                            <div className="TransactionWallets">
                                {this.props.data.inputs.map((tx,i) => {
                                    let addr = tx.from;
                                    let namedWallet = false;
                                    if (this.state.fetched) {
                                        for(let i = 0; i < this.state.trackedWallets.length; i++) {
                                            if (this.state.trackedWallets[i].wallet == tx.from) {
                                                addr = this.state.trackedWallets[i]['name'] + " *";
                                                namedWallet = true
                                                break;
                                            }
                                        }
                                        if (namedWallet) {
                                            return (<><a className="noOverflow" style={{ 'text-align': 'left', 'font-weight': '500' }} href={'../address/' + tx.from}>{addr}</a><span style={{ 'text-align': 'right' }} className="TransactionValueNegative"> (-{tx.value} BTC)</span></>)
                                        }
                                        else {
                                            return (<><a className="noOverflow" style={{ 'text-align': 'left', 'font-weight': '300' }} href={'../address/' + tx.from}>{addr}</a><span style={{ 'text-align': 'right' }} className="TransactionValueNegative"> (-{tx.value} BTC)</span></>)
                                        }
                                    }
                                })}
                            </div>
                        </div>
                        <p><span>&#8594;</span></p>
                        <div className="TransactionOutputs">
                            <p>Outputs</p>
                            <div className="TransactionWallets">
                                {this.props.data.outputs.map((tx,i) => {
                                    let addr = tx.to;
                                    let namedWallet = false;
                                    if (this.state.fetched) {
                                        for(let i = 0; i < this.state.trackedWallets.length; i++) {
                                            if (this.state.trackedWallets[i].wallet == tx.to) {
                                                addr = this.state.trackedWallets[i]['name'] + " *";
                                                namedWallet = true
                                                break;
                                            }
                                        }
                                        if (namedWallet) {
                                            return (<><a className="noOverflow" style={{'text-align': 'left', 'font-weight': '500'}} href={'../address/' + tx.to}>{addr}</a><span style={{'text-align': 'right'}} className="TransactionValuePositive"> (+{tx.value} BTC)</span></>)
                                        }
                                        else {
                                            return (<><a className="noOverflow" style={{'text-align': 'left', 'font-weight': '300'}} href={'../address/' + tx.to}>{addr}</a><span style={{'text-align': 'right'}} className="TransactionValuePositive"> (+{tx.value} BTC)</span></>)
                                        }
                                    }
                                })}
                            </div>
                        </div>  
                    </div>
                </div>
            )
        }
    };
};  
export default Transaction;