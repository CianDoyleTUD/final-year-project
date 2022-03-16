import Block from "../Components/Block";
import React from 'react';
import NavBar from "../Components/NavBar";

class BlockPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { apiResponse: "" }
    }
    
    componentDidMount() {
        this.fetchBlockData()
    }

    fetchBlockData() {
        let query =  window.location.pathname.substring(4);
        console.log(query) 
        fetch("http://localhost:3001/api/tx/" + query)
            .then(res => res.json())
            .then(res => this.setState({ apiResponse: res }));
    };

    render() {
        return (
            <>
            <NavBar /><div className="BlockPage">
                <Block blockdata={this.state.apiResponse} />
            </div></>
        );
    }
}
export default BlockPage;