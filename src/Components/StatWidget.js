import '../App.css';
import React from 'react';
import { UNIXToDate } from '../Utils/UtilFunctions';

class StatWidget extends React.Component{

  constructor(props) {
    super(props);
    this.state = {value: '', statValue: ""};
  }
  
  async fetchHistoricalPriceData() {
    fetch("http://localhost:3001/api/price/" + "2022-03-16")
        .then(res => res.json())
        .then(res => this.setState({statValue: res['price']}));
  }

  componentDidMount() {
    if (this.props.data.type == "price"){
      this.fetchHistoricalPriceData()
    }
    else if (this.props.data.type == "transactions"){
      //
    }
  }

  render()
  {
    if (!this.props.data) {
        return <p>Loading...</p>
    }
    return (
      <div className="statWidget">
          <p>
              {this.props.data.title}
          </p>
          <span>{this.state.statValue}</span>
      </div>
    );
  }
  
}

export default StatWidget;
