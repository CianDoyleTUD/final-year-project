import React, { PureComponent } from 'react';
import { Area, LineChart, Line, XAxis, YAxis, ReferenceArea, CartesianAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart } from 'recharts';

const getAxisYDomain = (data, from, to, ref, offset) => {
  const refData = data.filter(date => date.timestamp_unix >= from && date.timestamp_unix <= to)
  let [bottom, top] = [refData[0]['price'], refData[0]['price']];
  refData.forEach((date) => {
    if (date[ref] > top) top = date['price'];
    if (date[ref] < bottom) bottom = date['price'];
  });
  //console.log([(bottom | 0) - offset, (top | 0) + offset])
  return [(bottom | 0), (top | 0) + offset];
};

export default class Graph extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = { priceData: "", xLeft: "", xRight: "", yBottom: 0, yTop: "dataMax+5000", domainLeft: 1471788800, domainRight: "dataMax+1" }
    this.zoom = this.zoom.bind(this);
  }

  componentDidMount() {
    this.fetchHistoricalPriceData();
  }

  zoom() {
    const [bottom, top] = getAxisYDomain(this.state.priceData, this.state.xLeft, this.state.xRight, 'price', 5000);
    console.log("Top: " + top)
    console.log("Bottom: " + bottom)

    this.setState({domainLeft: this.state.xLeft, domainRight: this.state.xRight, yBottom: bottom, yTop: top}, () => {
      console.log('yBottom', this.state.yBottom);
      console.log('yTop', this.state.yTop);
    })
    this.setState({xLeft: "", xRight: ""})
  }

  fetchHistoricalPriceData() {
    fetch("http://localhost:3001/api/price/historical")
    .then(res => res.json())
    .then(res => {
      this.setState({priceData: res})
    })
  }

  render() {
    if (!this.state.priceData) {
      return (<div>Loading...</div>)
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={this.state.priceData} 
            onMouseDown={(e) => this.setState({xLeft: e.activeLabel})}
            onMouseMove={(e) => this.state.xLeft && this.setState({xRight: e.activeLabel})}
            onMouseUp={this.zoom}
          >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis xAxisId="1" allowDataOverflow type="number" dataKey="timestamp_unix" stroke='white' domain={[this.state.domainLeft, this.state.domainRight]}/>
          <YAxis allowDataOverflow dataKey="price" type='number' stroke='white' domain={[this.state.yBottom, this.state.yTop]}/>
          <Tooltip/>
          <Area xAxisId="1" type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={0.7} fill="url(#colorUv)" animationDuration={300} />
          {this.state.xLeft && this.state.xRight ? (
              <ReferenceArea xAxisId="1" x1={this.state.xLeft} x2={this.state.xRight} strokeOpacity={0.3} />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
    );
  }
}
