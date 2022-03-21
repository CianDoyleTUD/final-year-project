import '../App.css';
import React from 'react';
import { UNIXToDate } from '../Utils/UtilFunctions';

class StatWidget extends React.Component{

  constructor(props) {
    super(props);
    this.state = { statValue: ""};
  }

  componentDidMount() {
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
          <span>{this.props.data.value}</span>
      </div>
    );
  }
  
}

export default StatWidget;
