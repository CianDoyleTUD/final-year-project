import React from "react";
import NavBar from "../Components/NavBar";

Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class CalculatorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: "", displayStyle: "none", userHashRate: 100, consumption: 2500, cost: 0.1, commision: 0, profitAmount: 0, currentPrice: "", networkHashRate: "", blockReward: 6.25, miningChance: 0}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    calculateRewards() {
        const networkHashRate = this.state.networkHashRate;
        const userHashRate = this.state.userHashRate;
        const blockReward = this.state.blockReward;
        const blockMiningChance = userHashRate / networkHashRate;
        const hourlyMinedBlocks = blockMiningChance * 6;
        const hourlyRewards = hourlyMinedBlocks * blockReward;

        this.setState({profitAmount: hourlyRewards * clamp((1 - (this.state.commision/100)), 0, 1), miningChance: blockMiningChance})
    }

    async fetchData() {
        fetch("http://localhost:3001/api/price/" + "2013-01-01")
        .then(res => res.json())
        .then(res => this.setState({currentPrice: res[0]['price']}))

        fetch("http://localhost:3001/api/stats/" + "2013-01-01") //TODO: REPLACE DATE WITH 'today' 'STRING
        .then(res => res.json())
        .then(res => this.setState({networkHashRate: res[3200]['hash_rate']}))

        fetch("http://localhost:3001/api/price/" + "2013-01-01")
        .then(res => res.json())
        .then(res => this.setState({currentPrice: res[0]['price']}))
    }

    handleChange(event) {
        switch(event.target.id) {
            case 'hashrate':
                this.setState({userHashRate: event.target.value})
            break;
            case 'consumption':
                this.setState({consumption: event.target.value})
            break;
            case 'cost':
                this.setState({cost: event.target.value})
            break;
            case 'commision':
                this.setState({commision: event.target.value})
            break;
        }
        event.preventDefault()
    }

    handleSubmit(event) {
        this.calculateRewards()
        this.setState({displayStyle: "flex"})
        event.preventDefault()
    }
    
    componentDidMount() {
        this.fetchData();
    }

    render() {
        if(!sessionStorage.getItem('username')) {
            window.location = "http://localhost:3000/login";
        }
        return (
            <><NavBar></NavBar>
            <div className="CalculatorPage">
                <div className="calcContainer">
                    <h1>Bitcoin mining profitability calculator</h1>
                    <h4 style={{ "color": "white" }}>A common question asked is if it would be profitable for one to mine bitcoin with their system</h4>
                    <h4 style={{ "color": "white" }}>This tool allows you to determine the profitability of mining bitcoin with your system, whether it is a dedicated mining rig or a personal computer</h4>
                    <h4 style={{ "color": "white" }}>More info about bitcoin mining can be found <a href='#' style={{"color": "#3498db"}}>here</a></h4>
                    <div className="calcInputsContainer">
                        <span>The hash rate of your mining rig (TH/s)</span>
                        <input className="calcInput" id="hashrate" type="number" placeholder="Hash rate (TH/s)" value={this.state.userHashRate} onChange={this.handleChange} />
                        <span>The power consumption of your mining rig (Watts)</span>
                        <input className="calcInput" id="consumption" type="number" placeholder="Electricity consumption (Watts)" value={this.state.consumption} onChange={this.handleChange} />
                        <span>The cost of electricity in your region in ($/kWh)</span>
                        <input className="calcInput" id="cost" type="number" placeholder="Electricity cost ($/kWh)" value={this.state.cost} onChange={this.handleChange} />
                        <span>The percentage commision taken by the mining pool you use. Leave empty if no mining pool is used</span>
                        <input className="calcInput" id="commision" type="number" placeholder="Commission (%)" value={this.state.commision} onChange={this.handleChange} />
                        <button className="calculateButton" type="button" onClick={this.handleSubmit}>Calculate result</button>
                    </div>
                    
                    <div className="calcResults" style={{"display": this.state.displayStyle}}>
                    <h1 style={{margin: "1em auto"}}>Results</h1>
                        <table className="resultsTable">
                            <thead>
                                <th style={{width: "10%"}}></th>
                                <th style={{width: "30%", "font-size": "x-large"}}>BTC mined</th>
                                <th style={{width: "30%", "font-size": "x-large"}}>Profit</th>
                                <th style={{width: "30%", "font-size": "x-large"}}>Solo mining chance per block</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{"backgroundColor": "#45617e"}}>Hourly</td>
                                    <td>{(this.state.profitAmount).round(4)} BTC</td>
                                    {
                                        (this.state.profitAmount * this.state.currentPrice) - (this.state.cost * (this.state.consumption/1000)) > 0 ?
                                        <td style={{"color": "green"}}>${((this.state.profitAmount * this.state.currentPrice) - (this.state.cost * (this.state.consumption/1000))).round(2)}</td>
                                        :                                        
                                        <td style={{"color": "red"}}>${((this.state.profitAmount * this.state.currentPrice) - (this.state.cost * (this.state.consumption/1000))).round(2)}</td>
                                    }
                                    <td>~{100*(1-((1 - this.state.miningChance)**6))}%</td>
                                </tr>
                                <tr>
                                    <td style={{"backgroundColor": "#45617e"}}>Daily</td>
                                    <td>{(this.state.profitAmount * 24).round(4)} BTC</td>
                                    {
                                        (this.state.profitAmount * 24 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*24))) > 0 ?
                                        <td style={{"color": "green"}}>${(this.state.profitAmount * 24 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*24))).round(2)}</td>
                                        :
                                        <td style={{"color": "red"}}>${(this.state.profitAmount * 24 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*24))).round(2)}</td>
                                    }
                                    <td>~{100*(1-((1 - this.state.miningChance)**144))}%</td>
                                </tr>
                                <tr>
                                    <td style={{"backgroundColor": "#45617e"}}>Weekly</td>
                                    <td>{(this.state.profitAmount * 168).round(4)} BTC</td>
                                    {
                                        (this.state.profitAmount * 168 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*168))) > 0 ?
                                        <td style={{"color": "green"}}>${(this.state.profitAmount * 168 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*168))).round(2)}</td>
                                        :
                                        <td style={{"color": "red"}}>${(this.state.profitAmount * 168 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*168))).round(2)}</td>
                                    }
                                    <td>~{100*(1-((1 -this.state.miningChance)**1008))}%</td>
                                </tr>
                                <tr>
                                    <td style={{"backgroundColor": "#45617e"}}>Monthly</td>
                                    <td>{(this.state.profitAmount * 672).round(4)} BTC</td>
                                    {
                                        (this.state.profitAmount * 672 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*672))) > 0 ?
                                        <td style={{"color": "green"}}>${(this.state.profitAmount * 672 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*672))).round(2)}</td>
                                        :
                                        <td style={{"color": "red"}}>${(this.state.profitAmount * 672 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*672))).round(2)}</td>
                                    }
                                    <td>~{100*(1-((1 -this.state.miningChance)**4464))}%</td>
                                </tr>
                                <tr>
                                    <td style={{"backgroundColor": "#45617e"}}>Yearly</td>
                                    <td>{(this.state.profitAmount * 8736).round(4)} BTC</td>
                                    {
                                        (this.state.profitAmount * 8736 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*8064))) > 0 ?
                                        <td style={{"color": "green"}}>${(this.state.profitAmount * 8736 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*8064))).round(2)}</td>
                                        :
                                        <td style={{"color": "red"}}>${(this.state.profitAmount * 8736 * this.state.currentPrice - (this.state.cost * ((this.state.consumption/1000)*8064))).round(2)}</td>
                                    }
                                    <td>~{100*(1-((1 -this.state.miningChance)**52560))}%</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div></>
        )
    }
};  
export default CalculatorPage;

