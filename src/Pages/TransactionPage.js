import React from "react";
import NavBar from "../Components/NavBar";
import SearchBar from "../Components/SearchBar";
import Transaction from "../Components/Transaction";

class TransactionPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { tx: "" }
    }

    async fetchBlockData() {
        let query =  window.location.pathname.substring(4);
        fetch("http://localhost:3001/api/tx/" + query)
            .then(res => res.json())
            .then(res => {
                this.setState({ tx: res[0]['tx'][0] });
            })
    }

    componentDidMount() {
        this.fetchBlockData()
    }   



    render() {
        if (!this.state.tx) {
            return <div />
        }
        return (
            <><NavBar></NavBar>
            <SearchBar></SearchBar>
            <div className="TransactionPage">
                <div className="TransactionContainer">
                    <Transaction data={this.state.tx}/>
                </div>
            </div></>
        )
    }
};  
export default TransactionPage;