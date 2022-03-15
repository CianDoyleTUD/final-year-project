import './App.css';
import React from 'react';

class StatWidget extends React.Component{

  constructor(props) {
    super(props);
    this.state = {value: ''};
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
          <span>Sample data</span>
      </div>
    );
  }
  
}

export default StatWidget;
