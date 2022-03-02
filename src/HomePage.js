import React from 'react';
import LatestBlock from "./LatestBlock";
import LatestTransaction from "./LatestTransaction";
import NavBar from './NavBar.js';
import SearchBar from './SearchBar.js';
import logo from './btc.png';

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
            <>
            <div className="HomePage">
                <NavBar/>
                <img src={logo}></img>
                <SearchBar/>
                <div className='Latest'>
                    <div className="LatestBlocks">
                        <table style={{width: "100%"}}className="LatestBlockTable">
                            <thead>
                                <th style={{width: "60%"}}>Block hash</th>
                                <th style={{width: "20%"}}>Block height</th>
                                <th style={{width: "20%"}}>Mined</th>
                            </thead>
                            <tbody>
                                {this.state.apiResponse.map((transaction, i) => <LatestBlock key={i} data={transaction}/>)}
                            </tbody>
                        </table>
                    </div>
                    <div className="LatestTransactions">
                        {this.state.apiResponse.map((transaction, i) => <LatestTransaction key={i} data={transaction} />)}
                    </div>
                </div>
            </div>
            </>
        );
    }
}
export default HomePage;