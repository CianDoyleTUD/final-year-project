import React, { PureComponent } from 'react';
import { Area, LineChart, Label, Line, XAxis, YAxis, ReferenceArea, CartesianAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, ComposedChart } from 'recharts';
import { UNIXToDate } from '../Utils/UtilFunctions';

export default class Graph extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = { originalData: "", priceData: "", csvFile: "", csvHref: "", scale: "linear", xLeft: "", xRight: "", yBottom: 0, yTop: "dataMax+1", domainLeft: 0, domainRight: "dataMax+1", lastTime: "", chartElement: <Area xAxisId="1" type="linear" dataKey="price" stroke="#00a8ff" fillOpacity={0.7} fill="url(#colorUv)" animationDuration={300} /> }
    this.zoom = this.zoom.bind(this);
    this.setTimeframe = this.setTimeframe.bind(this);
    this.scrollZoom = this.scrollZoom.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.updateCSV = this.updateCSV.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    switch(this.props.data.type) {
      case 'price':
        this.setState({
          domainLeft: 1301788800,
          dataStartPoint: 1301788800,
          title: "Bitcoin price",
          description: "Daily closing prices of bitcoin in dollars.",
          xLabel: "Date",
          yLabel: "Price ($)",
          logStart: 1,
        })
        this.fetchHistoricalPriceData();
      break;
      case 'hash_rate':
        this.setState({
          domainRight:1377688800, 
          domainLeft: 1251788800, 
          dataStartPoint: 1251788800, 
          title: "Network hash rate", 
          description: <><p>The estimated hash rate for the Bitcoin network per day, measured in TH/s. The hash rate is a measurement of the computing power dedicated to mining bitcoin and represents the security of the network. The formula for calculating this is:</p><p>(2^32 x (D/ Ta)) / 1e12</p><p>D = Difficulty of the latest block</p><p>Ta = Average time between blocks produced for the day</p></>,
          xLabel: "Date",
          yLabel: "Hash rate (TH/s)",
          logStart: 0.00001,
          chartElement: <Area xAxisId="1" type="linear" dataKey="hash_rate" stroke="#00a8ff" fillOpacity={0.7} fill="url(#colorUv)" animationDuration={300} /> 
        })
        this.fetchHistoricalHashRate();
      break;
      case 'transaction_count':
        this.setState({
          domainRight:1377688800, 
          domainLeft: 1251788800, 
          dataStartPoint: 1251788800, 
          title: "Daily transaction count", 
          description: <><p>Number of transactions confirmed on the bitcoin network per day</p></>,
          xLabel: "Date",
          yLabel: "Transactions",
          logStart: 50,
          chartElement: <Area xAxisId="1" type="linear" dataKey="transaction_count" stroke="#00a8ff" fillOpacity={0.7} fill="url(#colorUv)" animationDuration={300} /> 
        })
        this.fetchHistoricalTransactions();
      break;
    }    
  }

  fetchHistoricalPriceData() {
    fetch("http://localhost:3001/api/price/historical")
    .then(res => res.json())
    .then(res => {this.setState({priceData: res, originalData: res, lastTime: res[res.length - 1]['timestamp_unix']}, () => {
      this.setState({csvFile: "date,price\n"}, async () => {
        let csvString = "";
        for(let i = 0; i < res.length; i++){
          let csvLine = res[i]['date'] + "," + res[i]['price'] + "\n"
          csvString += csvLine
        } 
        this.setState({csvFile: this.state.csvFile + csvString})
      })
    })})
  }

  fetchHistoricalHashRate() {
    fetch("http://localhost:3001/api/stats/hash_rate")
    .then(res => res.json())
    .then(res => {this.setState({dataSet: res, originalDataSet: res, lastTime: res[0]['timestamp_unix']}, () => {
      const max = Math.max.apply(Math, res.map(function(data) { return data.hash_rate }))
      this.setState({yTop: max})
      this.setState({csvFile: "date,hashrate\n"}, async () => {
        let csvString = "";
        for(let i = 0; i < res.length; i++){
          let csvLine = res[i]['date'] + "," + res[i]['hash_rate'] + "\n"
          csvString += csvLine
        } 
        this.setState({csvFile: this.state.csvFile + csvString})
      })
    })})
  }

  fetchHistoricalTransactions() {
    fetch("http://localhost:3001/api/stats/transaction_count")
    .then(res => res.json())
    .then(res => {this.setState({dataSet: res, originalDataSet: res, lastTime: res[res.length - 1]['timestamp_unix']}, () => {
      const max = Math.max.apply(Math, res.map(function(data) { return data.transaction_count }))
      this.setState({yTop: max})
      this.setState({csvFile: "date,transaction count\n"}, async () => {
        let csvString = "";
        for(let i = 0; i < res.length; i++){
          let csvLine = res[i]['date'] + "," + res[i]['transaction_count'] + "\n"
          csvString += csvLine
        } 
        this.setState({csvFile: this.state.csvFile + csvString})
      })
    })})
  }


  getAxisYDomain = (data, from, to, ref, offset) => {
    const refData = data.filter(date => date.timestamp_unix >= from && date.timestamp_unix <= to)
    const type = this.props.data.type
    const max = Math.max.apply(Math, refData.map(function(data) { return data[type] }))
    const min = Math.min.apply(Math, refData.map(function(data) { return data[type] }))
    return [(min | 0), (max | 0) + offset];
  };
  
  downloadData() {
    this.setState({csvHref: 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.state.csvFile)}, () => {
      window.location.href = this.state.csvHref;
    }); 
  }

  zoom() {
    const dataSet = (this.props.data.type == 'price') ? this.state.priceData : this.state.dataSet
    const zoomLevel = (this.props.data.type == 'price') ? 1 : 1
    const [bottom, top] = this.getAxisYDomain(dataSet, this.state.xLeft, this.state.xRight, this.props.data.type, zoomLevel);
    this.setState({domainLeft: this.state.xLeft, domainRight: this.state.xRight, yBottom: bottom, yTop: top})
    this.setState({xLeft: "", xRight: ""})
  }

  scrollZoom() {
  }

  resetZoom() {
    this.setState({priceData: this.state.originalData}, () => {
      this.setState({domainLeft: this.setState({domainLeft: this.state.dataStartPoint}), domainRight: "dataMax+1", yBottom: 0, yTop: "dataMax+1"})
      this.setState({xLeft: "", xRight: ""})
      if(!this.state.priceData) {
        const type = this.props.data.type
        const max = Math.max.apply(Math, this.state.dataSet.map(function(data) { return data[type] }))
        this.setState({yTop: max})
      }
    })
  }         
  
  setTimeframe(event) {
    const timeframe = (event.target.value == 'all') ? 346032000 : (event.target.value * 86400);
    const slicedData = this.state.originalData.slice(-event.target.value); 
    const dataSet = (this.props.data.type == 'price') ? this.state.priceData : this.state.dataSet
    this.setState({priceData: slicedData}, () => {
      const [bottom, top] = this.getAxisYDomain(dataSet, this.state.lastTime - timeframe, this.state.lastTime,  this.props.data.type, 1);
      this.setState({domainLeft: this.state.lastTime - timeframe, domainRight: "dataMax+1", yBottom: bottom, yTop: top})
    })
  }                    

  formatXAxis (timestamp) {
    return UNIXToDate(timestamp*1000)
  }

  handleChange(event) {
    switch(event.target.value) {
      case 'Area':
        this.setState({scale: "linear", chartElement: <Area xAxisId="1" type="linear" dataKey={this.props.data.type} stroke="#00a8ff" fillOpacity={0.7} fill="url(#colorUv)" animationDuration={300} /> })
      break;
      case 'linear':
        this.setState({scale: "linear", chartElement: <Line xAxisId="1" type="linear" dataKey={this.props.data.type} stroke="#00a8ff" dot={false} animationDuration={300} />})
      break;
      case 'basis':
        this.setState({scale: "linear", chartElement: <Area xAxisId="1" type="basisClosed" dataKey={this.props.data.type} stroke="#00a8ff" dot={false} fillOpacity={0.7} fill="url(#basisGradient)" animationDuration={300} />})
      break;
      case 'logarithmic':
        this.setState({scale: "log", chartElement: <Line xAxisId="1" type="linear" dataKey={this.props.data.type} stroke="#00a8ff" dot={false} animationDuration={300} />})
      break;
    }
    event.preventDefault()
  }

  updateCSV(data) {
    return this.state.csvFile + data['date'] + "," + data[this.props.data.type] + "\n"
  }

  render() {
    if (!this.state.csvFile) {
        return (<div>Loading data</div>)
    }
    return (
      <div className='graphWrapper'>
      <div className='graphTitle'>
        <h1>{this.state.title}</h1>
        <p>{this.state.description}</p>
      </div>
      <ResponsiveContainer width="100%" height="80%">
          <ComposedChart data={this.state.priceData ? this.state.priceData : this.state.dataSet}
            onMouseDown={(e) => this.setState({ xLeft: e.activeLabel })}
            onMouseMove={(e) => this.state.xLeft && this.setState({ xRight: e.activeLabel })}
            onWheel={(e) => this.zoom}
            onMouseUp={this.zoom}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00a8ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00a8ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="basisGradient" x1="0" y1="0" x2="0" y2="0">
                <stop offset="100%" stopColor="#00a8ff" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <XAxis label={<Label axisType='yAxis' position="bottom" stroke='#ffffff'>{this.state.xLabel}</Label>} tickCount={10} tickFormatter={this.formatXAxis} xAxisId="1" allowDataOverflow type="number" dataKey="timestamp_unix" stroke='white' domain={[this.state.domainLeft, this.state.domainRight]} />
            {this.state.scale == 'linear' ?
              <YAxis scale="linear" label={<Label axisType='yAxis' angle={270} position='left' stroke='#ffffff'>{this.state.yLabel}</Label>} tickCount={10} allowDataOverflow dataKey={this.props.data.type} type='number' stroke='white' domain={[this.state.yBottom, this.state.yTop]} />
              :
              <YAxis scale="log" label={<Label axisType='yAxis' angle={270} position='left' stroke='#ffffff'>{this.state.yLabel}</Label>} tickCount={10} allowDataOverflow dataKey={this.props.data.type} type='number' stroke='white' domain={[this.state.logStart, "auto"]} />}
            <Tooltip />
            {this.state.chartElement}
            {this.state.xLeft && this.state.xRight ? (
              <ReferenceArea xAxisId="1" x1={this.state.xLeft} x2={this.state.xRight} strokeOpacity={0.3} />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer><div className='chartButtonContainer'>
          <select name="chart-type" value={this.state.chartType} onChange={this.handleChange}>
            <option value="Area">Area chart</option>
            <option value="linear">Line chart</option>
            <option value="basis">Basis chart</option>
            <option value="logarithmic">Log scale</option>
          </select>
          <button onClick={this.resetZoom}>Reset zoom</button>
          <div className='chartButtonTimeframes'>
            <button value={"30"} onClick={(event) => this.setTimeframe(event)}>30 days</button>
            <button value={"90"} onClick={(event) => this.setTimeframe(event)}>90 days</button>
            <button value={"365"} onClick={(event) => this.setTimeframe(event)}>1 year</button>
            <button value={"1095"} onClick={(event) => this.setTimeframe(event)}>3 year</button>
            <button value={"all"} onClick={(event) => this.setTimeframe(event)}>All time</button>
          </div>
          <button download="transaction_data.csv" onClick={this.downloadData}>Download raw data</button>
        </div>
        </div>
    );
  }
}
