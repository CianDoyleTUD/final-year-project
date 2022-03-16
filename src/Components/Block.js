import TransactionTable from "./TransactionTable";
import React from "react";
import { Link } from "react-router-dom";

class Block extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.blockdata.tx) {
            return <div />
        }
        return (
            <><div className="Block">
                <div className="BlockHeader">
                    <h1>Block {this.props.blockdata.height}</h1>
                </div>
                <div className="BlockInfo">
                    <table className="BlockTable">
                        <tbody>
                            <tr>
                                <td>Hash</td>
                                <td>{this.props.blockdata.hash}</td>
                            </tr>
                            <tr>
                                <td>Timestamp</td>
                                <td>{this.props.blockdata.time}</td>
                            </tr>
                            <tr>
                                <td>Height</td>
                                <td>{this.props.blockdata.height}</td>
                            </tr>
                            <tr>
                                <td>Transaction count</td>
                                <td>{this.props.blockdata.nTx}</td>
                            </tr>
                            <tr>
                                <td>Difficulty</td>
                                <td>{this.props.blockdata.difficulty}</td>
                            </tr>
                            <tr>
                                <td>Version</td>
                                <td>{this.props.blockdata.version}</td>
                            </tr>
                            <tr>
                                <td>Bits</td>
                                <td>{this.props.blockdata.bits}</td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td>{this.props.blockdata.size} bytes</td>
                            </tr>
                            <tr>
                                <td>Previous block hash</td>
                                <td><Link onClick={this.forceUpdate} to={"/tx/" + this.props.blockdata.previousblockhash}>{this.props.blockdata.previousblockhash}</Link></td>
                            </tr>
                            <tr>
                                <td>Next block hash</td>
                                <td><Link onClick={this.forceUpdate} to={"/tx/" + this.props.blockdata.nextblockhash}>{this.props.blockdata.nextblockhash}</Link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="BlockTransactions">
                <TransactionTable data={this.props.blockdata.tx}/>
            </div></>
        )
    };
};  
export default Block;