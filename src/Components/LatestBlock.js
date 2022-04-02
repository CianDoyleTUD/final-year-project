import React from "react";

class LatestBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = { formattedTime: "" }
    }

    // Calculates how long ago blocks were mined
    calculateBlockTimes() {
        let timeDifference = (Date.now() / 1000) - this.props.data.time;
        if(timeDifference < 60){
            this.setState({formattedTime: timeDifference + " seconds ago"})
        }
        else if(timeDifference < 3600){
            this.setState({formattedTime: (timeDifference / 60) + " minutes ago"})
        }
        else if(timeDifference < 86400) {
            this.setState({formattedTime: (timeDifference / 3600) + " hours ago"})
        }
        else {
            this.setState({formattedTime: Math.floor(timeDifference / 86400) + " days ago"})
        }
    }

    componentDidMount() {
        this.calculateBlockTimes();
    }
    
    render() {
        if (!this.props.data) {
            return <p>Loading...</p>
        }
        return (
            <tr className="LatestTableRow">
                <td>
                    <a href={ 'block/' + this.props.data.hash }>{this.props.data.hash}</a>
                </td>
                <td>
                    <span>{this.props.data.height}</span>
                </td>
                <td>
                    <span>{this.state.formattedTime}</span>
                </td>
            </tr>
        )
    }
};  
export default LatestBlock;