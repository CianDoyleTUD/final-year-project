import React from "react";
import { calculateBlockTimes } from "../Utils//UtilFunctions";

class LatestTransaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { formattedTime: "" }
    }

    componentDidMount() {
        this.setState({formattedTime: calculateBlockTimes(this.props.data.time)})
        console.log(this.props.data.time)
    }
    
    render() {
        if (!this.props.data) {
            return <p>Loading...</p>
        }
        return (
                <tr className="LatestTableRow">
                    <td>
                        <a href={ 'tr/' + this.props.data.txid }>{this.props.data.txid}</a>
                    </td>
                    <td>
                        <span>{this.state.formattedTime}</span>
                    </td>
                </tr>
        )
    }
};  
export default LatestTransaction;