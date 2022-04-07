import Block from "../Components/Block";
import React from 'react';
import NavBar from "../Components/NavBar";

class BlockPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = { blockData: "" }
    }
    
    componentDidMount() {
        this.fetchBlockData()
    }

    fetchBlockData() {
        let query =  window.location.pathname.substring(7);
        console.log(query) 
        fetch("http://localhost:3001/api/block/" + query)
            .then(res => res.json())
            .then(res => this.setState({ blockData: res }));
    };

    render() {
        return (
            <>
            <NavBar /><div className="BlockPage">
                <Block blockdata={this.state.blockData} />
            </div></>
        );
    }
}
export default BlockPage;