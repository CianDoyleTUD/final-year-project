import React from "react";
import Transaction from "./Transaction";

const transactionCount = 5;

class TransactionTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = { startIndex: 0, endIndex: transactionCount, nextButton: "", backButton: "" }
    }

    displayNextTransactions() {
        this.setState({ startIndex: this.state.startIndex + transactionCount, endIndex: this.state.endIndex + transactionCount}, () => {  
            if(this.state.endIndex > this.props.data.length) {
                this.setState({nextButton: ""})
            }
            else {
                this.setState({nextButton: <button ref={(element) => { this.nextButton = element; }} className="nextButton" onClick={this.displayNextTransactions.bind(this)}>&#62;&#62;&#62;</button>})
            }
            this.setState({backButton: <button ref={(element) => { this.nextButton = element; }} className="nextButton" onClick={this.displayPreviousTransactions.bind(this)}>&#60;&#60;&#60;</button>})
        })
        this.nextButton.scrollIntoView();
    }

    displayPreviousTransactions() {
        this.setState({startIndex: this.state.startIndex - transactionCount, endIndex: this.state.endIndex - transactionCount}, () => { 
            if(this.state.startIndex <= 0) {
                this.setState({backButton: ""})
            }
            else {
                this.setState({backButton: <button ref={(element) => { this.nextButton = element; }} className="nextButton" onClick={this.displayPreviousTransactions.bind(this)}>&#60;&#60;&#60;</button>})
            }
            this.setState({nextButton: <button ref={(element) => { this.nextButton = element; }} className="nextButton" onClick={this.displayNextTransactions.bind(this)}>&#62;&#62;&#62;</button>})
        })
        this.nextButton.scrollIntoView();
    }

    componentDidMount(){
        if(this.state.endIndex < this.props.data.length) {
            this.setState({nextButton: <button ref={(element) => { this.nextButton = element; }} className="nextButton" onClick={this.displayNextTransactions.bind(this)}>&#62;&#62;&#62;</button>})
        }
    }

    render() {
        if (!this.props.data) {
            return <div />
        }
        return (
            <div className="TransactionTable">
                <table>
                    {this.props.data.slice(this.state.startIndex, this.state.endIndex).map((transaction, i) => {return <Transaction key={i} data={transaction}/>})}
                    {this.state.backButton}
                    {this.state.nextButton}
                </table>
            </div>
        )
    };
};  
export default TransactionTable;
