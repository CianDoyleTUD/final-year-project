import React from "react";
import Transaction from "./Transaction";

class TransactionTable extends React.Component {

    constructor(props) {
        super(props);
        this.tooManyOutputs = false;
    }
    
    render() {
        if (!this.props.data) {
            return <div />
        }
        return (
            <div className="TransactionTable">
                <table>
                    {this.props.data.map((transaction, i) => 
                    {
                        if(i < 5)
                            return <Transaction key={i} data={transaction}/>
                        if(this.tooManyOutputs)
                            return
                        else
                            this.tooManyOutputs = true;
                            return <a>View full transaction list</a>
                    })}
                </table>
            </div>
        )
    };
};  
export default TransactionTable;