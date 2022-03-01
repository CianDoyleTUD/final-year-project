import React from 'react';
import LatestBlock from "./LatestBlock";
import LatestTransaction from "./LatestTransaction";

class HomePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { apiResponse: [] }
    }
    
    componentDidMount() {
        this.fetchLatestBlocks()
    }

    fetchLatestBlocks() {
        fetch("http://localhost:3001/api/latest")
            .then(res => res.json())
            .then(res => this.setState({ apiResponse: res }));
    };

    render() {
        console.log(this.state.apiResponse);
        return (
            <div className="HomePage">
                <div className='Latest'>
                    <div className="LatestBlocks">
                        {this.state.apiResponse.map((transaction, i) => <LatestBlock data ={transaction}/>)}
                    </div>
                    <div className="LatestTransactions">
                        {this.state.apiResponse.map((transaction, i) => <LatestTransaction data ={transaction}/>)}
                    </div>
                </div>
            </div>
        );
    }
}
export default HomePage;