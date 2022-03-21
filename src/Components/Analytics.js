import '../App.css';
import React from 'react';

class Analytics extends React.Component{

    constructor(props) {
        super(props);
        this.state = {value: '', statValue: ""};
    }
  

    componentDidMount() {
    }

    render(){
        return (
            <div className="WalletsContainer">
                <h1>Analytics</h1>
            </div>
        )
    }
  
}

export default Analytics;
