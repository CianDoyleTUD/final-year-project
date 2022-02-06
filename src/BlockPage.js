import Block from "./Block";
import React from 'react';

class BlockPage extends React.Component{

    
    constructor(props) {
        super(props);
        this.state = { apiResponse: ""}
    }
    
    componentDidMount() {
        const win = window.location.pathname;
        console.log(win);
        this.callBackendAPI()
    }

    callBackendAPI() {
        fetch("http://localhost:3001/api")
            .then(res => res.json())
            .then(res => this.setState({ apiResponse: res }));
    };

    render() {
        return (
            <div className="BlockPage">
                <Block blockdata={this.state.apiResponse}/>
            </div>
        );
    }
}
export default BlockPage;