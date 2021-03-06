import '../App.css';
import React from 'react';

class SearchBar extends React.Component{

  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {    
    this.setState({value: event.target.value});  
  }

  handleSubmit(event) {
    const query = this.state.value;
    if (query.startsWith('000')) { // Block
      window.location = "http://localhost:3000/block/" +  this.state.value;
    }
    else if (query.startsWith(1) || query.startsWith(3) || query.startsWith("b")) { // Address
      if (query.startsWith(1) && query.length > 36) {
        window.location = "http://localhost:3000/tr/" +  this.state.value;
      }
      else {
        window.location = "http://localhost:3000/address/" +  this.state.value;
      }
    }
    else { // Transaction
      window.location = "http://localhost:3000/tr/" +  this.state.value;
    }
    event.preventDefault();
  }	
  
  render()
  {
    return (
      <div className="SearchBarContainer">
        <form action="" onSubmit={this.handleSubmit}>
          <input type="text" className="SearchBar" value={this.state.value} onChange={this.handleChange} placeholder="Search for a transaction, block or wallet"/>
        </form>
      </div>
    );
  }
  
}

export default SearchBar;
