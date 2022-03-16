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
    window.location = "http://localhost:3000/tx/" +  this.state.value;
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
