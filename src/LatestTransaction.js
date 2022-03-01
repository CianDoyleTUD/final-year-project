import React from "react";

class LatestTransaction extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        if (!this.props.data) {
            return <p>Loading...</p>
        }
        return (
            <div className="LatestBlockInfo">
                <><a href={ 'tx/' + this.props.data._id }>{this.props.data._id}</a><span>{this.props.data.height}</span><span>{this.props.data.time}</span></>
            </div>
        )
    }
};  
export default LatestTransaction;