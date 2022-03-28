import '../App.css';
import React from 'react';

const notifications = [{"txid": "0x9r23uu98f892ehf", "time": 312320233}]
class Notifications extends React.Component{

    constructor(props) {
        super(props);
        this.state = { notifications: "", notificationCount: 0};
        this.markAsRead = this.markAsRead.bind(this);
    }

    componentDidMount() {
        this.fetchNotifications();
    }

    markAsRead() {
        const fetchData = {
            method: "POST",
            mode: 'cors',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({username: sessionStorage.getItem('username')})
        }
        fetch("http://localhost:3001/marknotifications/", fetchData)
            .then(res => res.json())
            .then(res => this.setState({notificationCount: 0}));
    }

    async fetchNotifications() {
        const username = sessionStorage.getItem('username');
        fetch("http://localhost:3001/api/trackedwallets/" + username)
            .then(res => res.json())
            .then(res =>  this.setState({ notifications: res['notifications'].sort((a, b) => parseFloat(a.timestamp) - parseFloat(b.timestamp))}, () => {
                let total = 0
                for (let i = 0; i <  this.state.notifications.length; i++) {
                    if (!this.state.notifications[i].read) total += 1
                }
                this.setState({notificationCount: total})
            }))
    }

    render(){
        if(!this.state.notifications) {
            return(<div>Loading...</div>)
        }

        return (
            <div className="NotificationsContainer">
                <div className='NotificationsHeader'>
                    <h1>Notifications ({this.state.notificationCount})</h1>
                    <button onClick={this.markAsRead} className='readButton'>Mark as read</button>
                </div>
                <div className="NotificationsBody">
                    {this.state.notifications.map((notification, i) => {
                        if(!notification.read) {
                            return (
                                <div key={i} className='NotificationContainerUnread'>
                                    <span>New transaction from tracked wallet</span>
                                    <span>{notification.time}</span>
                                    <a href={'http://localhost:3000/tr/' + notification.txid}>View transaction details</a>
                                </div>
                            )
                        } 
                        else {
                            return ( 
                                <div key={i} className='NotificationContainerRead'>
                                    <span>New transaction from tracked wallet</span>
                                    <span>{notification.time}</span>
                                    <a href={'http://localhost:3000/tr/' + notification.txid}>View transaction details</a>
                                </div>
                            )
                        }                   
                    })}
                </div>
            </div>
        )
    }
}

export default Notifications;
