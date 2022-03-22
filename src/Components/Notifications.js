import '../App.css';
import React from 'react';

const notifications = [{"txid": "0x9r23uu98f892ehf", "time": 312320233}]
class Notifications extends React.Component{

    constructor(props) {
        super(props);
        this.state = { notifications : [{"name": "abbab", "wallet": "dawdad"}]};
    }

    componentDidMount() {
        this.fetchNotifications();
    }

    async fetchNotifications() {
        const username = sessionStorage.getItem('username');
        fetch("http://localhost:3001/api/notifications/" + username)
            .then(res => res.json())
            .then(res => this.setState({trackedWallets: res}))
    }

    render(){
        return (
            <div className="NotificationsContainer">
                <div className='NotificationsHeader'>
                    <h1>Notifications</h1>
                </div>
                <div className="NotificationsBody">
                    {this.state.notifications.map((notification, i) => {
                        return (
                            <div className='TrackedWalletContainer'>
                                <span>{notification.txid}</span>
                                <span>{notification.time}</span>
                                <a href={'http://localhost:3000/tr/' + notification.txid}>View transaction details</a>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
  
}

export default Notifications;
