import React from 'react';
import LatestBlock from "../Components/LatestBlock";
import LatestTransaction from "../Components/LatestTransaction";
import NavBar from '../Components/NavBar';
import SearchBar from '../Components/SearchBar'
import logo from './btc.png';
import StatWidget from '../Components/StatWidget';

class HomePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { blocks: "", stats: "", price: 0.0 }
    }
    
    componentDidMount() {
        this.fetchLatestBlocks()
        this.fetchHeaderStats()
        this.fetchCurrentPrice()
    }

    fetchLatestBlocks() {
        fetch("http://localhost:3001/api/latest")
            .then(res => res.json())
            .then(res => this.setState({ blocks: res }));
    };

    fetchHeaderStats() {
        fetch("http://localhost:3001/api/stats/today")
            .then(res => res.json())
            .then(res => {
                this.setState({ stats: res[0] }) 
            });
    }

    fetchCurrentPrice() {
        const today = new Date();
        const date = today.getFullYear() + "-" +  String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        fetch("http://localhost:3001/api/price/today")
            .then(res => res.json())
            .then(res =>  {
                console.log(res)
                if (res) {
                    this.setState({price: res[0]['price']})
                }
            });
    }

    render() {
        if(!this.state.blocks) {
            return (<div>Loading...</div>)
        }
        else {
            return (
                <>
                <div className="HomePage">
                    <NavBar/>
                    <div className='statWidgetContainer'>
                        <StatWidget data = {{title: "Current price ($)", value: this.state.price}}/>
                        <StatWidget data = {{title: "Transactions (24h)", value: this.state.stats.transaction_count}}/>
                        <StatWidget data = {{title: "Network Hash rate", value: this.state.stats.hash_rate}}/>
                    </div>
            
                    <img src={logo}></img>
           
                    <SearchBar/>
                    <div className='Latest'>
                        <div className="LatestBlocks">
                            <table style={{width: "100%"}}className="LatestBlockTable">
                                <thead>
                                    <th className='latestTableHeader' style={{width: "60%"}}>Block hash</th>
                                    <th className='latestTableHeader' style={{width: "20%"}}>Block height</th>
                                    <th className='latestTableHeader' style={{width: "20%"}}>Mined</th>
                                </thead>
                                <tbody>
                                    {this.state.blocks['block_headers'].map((transaction, i) => <LatestBlock key={i} data={transaction}/>)} 
                                </tbody>
                            </table>
                        </div>
                        <div className="LatestBlocks">
                            <table style={{width: "100%"}}className="LatestBlockTable">
                                <thead>
                                    <th className='latestTableHeader' style={{width: "60%"}}>Transaction hash</th>
                                    <th className='latestTableHeader' style={{width: "40%"}}>Time</th>
                                </thead>
                                <tbody>
                                    {this.state.blocks['block_full'][0]['tx'].slice(0, 5).map((transaction, i) => {
                                        return (<LatestTransaction key={i} data={transaction}/>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                </>
            );
        }
    }
}
export default HomePage;