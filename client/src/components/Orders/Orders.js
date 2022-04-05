import React, { Component } from "react";
import axios from 'axios'

import OrdersHistory from "./OrdersHistory";
import UpcomingEvents from "./UpcomingEvents";
import { Navigate } from "react-router-dom";
import {  SessionContext } from "../SessionCookie/SessionCookie";
import Spinner from "../Spinner/Spinner";
import Notification from "../Notifications/Notification";
import {ERRORS, NOTIFICATIONS, ORDER_STATUS, EMPTY_DATASET} from '../constants.js'

class Orders extends Component{
    constructor(){
        super()
        this.state={
            isLoading:true,
            isOrderHistory: true,
            ordersHistory: [],
            upcomingEvents: [],
            notifications: [],
            errorMessages: []
        }
        this.onCancelOrder = this.onCancelOrder.bind(this)
        this.splitOrders = this.splitOrders.bind(this)
        this.onCloseNotification = this.onCloseNotification.bind(this)
    }
    static contextType = SessionContext

    onTabClick(value){
        this.setState({...this.state, isOrderHistory:value})
    }

    splitOrders(orders) {
        let ordersHistory = orders.filter(order => {
            return ((new Date(order.date + ' ' + order.endtime)) < new Date() || order.status === "Cancelled")
        })
        let upcomingEvents = orders.filter(order => {
            return ((new Date(order.date + ' ' + order.endtime)) > new Date() && order.status === "Confirmed")
        })
        this.setState({ ...this.state, upcomingEvents, ordersHistory })
    }
    componentDidMount(){
        //TODO: API TO FETCH ALL ORDERS
        let userid = this.context.getUser()._id;
        axios.get(`api/v1/order/user/${userid}`,{
            headers: {
                'Authorization': 'Bearer '+ this.context.getToken()
            }
        }).then(res => {
            console.log(res.data);

            let orders = res.data.orders.map(order => {
                return {
                    id: order._id,
                    userid: order.userID._id,
                    eventid: order.eventID._id,
                    eventname: order.eventID[0].eventname,
                    city: order.eventID[0].city[0],
                    date: order.eventID[0].slots[0].date, //TODO: GET ONLY DATE
                    endtime: order.eventID[0].slots[0].endtime,
                    starttime: order.eventID[0].slots[0].starttime,
                    viptickets: order.vipticks,
                    gatickets: order.gaticks,
                    status: order.orderStatus,
                    createddate: order.createdAt,
                    modifieddate: order.updatedAt,
                    totalprice: order.price
                }
            })

            this.splitOrders(orders)
            this.setState({ ...this.state, isLoading: false, orders: orders })

        }).catch(err => {
            console.log(err)
        });
    }
    onCancelOrder(orderid){
        /**TODO - API - SEND ORDER ID 
         *            - UPDATE ORDER STATUS TO CANCELLED
         *            - UPDATE AVAILABLE TICKETS IN EVENTS SCHEMA
        */
         var { errorMessages, notifications, orders } = this.state;

        const token = this.context.getToken()
        axios.put(`api/v1/order/${orderid}`,{}, {
            headers: {
                'Authorization': 'Bearer '+ token
            }
        }).then(res => {
            console.log(res.data);
            if (res.status === 200 && res.data) {
                notifications.push(NOTIFICATIONS.CANCELLED)
                const filteredorder = orders.find(o => o.id === orderid)
                filteredorder.status = ORDER_STATUS.CANCELLED
                this.splitOrders(orders)
                this.setState({ ...this.state, notifications, errorMessages: [], isLoading: false, orders })
            }

        }).catch(err => {
            // console.log(err);
            errorMessages.push(ERRORS.CANCELERROR);
            this.setState({ ...this.state, errorMessages, notifications: [], isLoading: false })
        });
    }
    onCloseNotification(id, isError) {
        var { errorMessages, notifications } = this.state
        if (isError) {
            errorMessages = errorMessages.filter((err, index) => index !== id)
            this.setState({ ...this.state, errorMessages })
        }
        else {
            notifications = notifications.filter((notification, index) => index !== id)
            this.setState({ ...this.state, notifications })
        }
    }

    displayNotification(isError) {
        let { errorMessages, notifications } = this.state
        var obj = isError ? errorMessages : notifications
        return (
            <div className='notifications'>
                {obj.map((item, index) => {
                    return <Notification key={index}
                        isError={isError}
                        id={index}
                        message={item}
                        onClose={this.onCloseNotification} />
                })}
            </div>
        )
    }
    render(){
        let {isOrderHistory, ordersHistory, upcomingEvents, orders, errorMessages, notifications, isLoading} = this.state
        let user = this.context.getUser()
        return (
            <>
            <Spinner isLoading={isLoading}/>
            {errorMessages.length ? this.displayNotification(true) : ""}
            {notifications.length ? this.displayNotification(false) : ""}
            {!user 
             ? (<Navigate to="/login" replace={true}/>)
             : <div className="orders">
                    <h3>My orders</h3>
                    <div className="body">
                    {
                        orders && orders.length === 0
                         ? <p>{EMPTY_DATASET.NO_ORDERS}</p>
                         : <>
                            <div className="form-header">
                                <label className={isOrderHistory? 'tab-active':''}
                                        onClick={()=>this.onTabClick(true)}>ORDERS HISTORY</label>
                                <label className={!isOrderHistory? 'tab-active':''}
                                        onClick={()=>this.onTabClick(false)}>UPCOMING / ACTIVE EVENTS</label>
                            </div>
                            <div>
                                {
                                    isOrderHistory 
                                    ? <OrdersHistory orders={ordersHistory}/>
                                    : <UpcomingEvents events={upcomingEvents} onCancelOrder={this.onCancelOrder}/>
                                }
                            </div>
                            </>
                    }
                    </div>
                </div>
            }
            </>
        )
    }
}

export default Orders


// const ERRORS = {
//     CANCELERROR: "Order is already cancelled. Please refresh the page"
// }

// const NOTIFICATIONS = {
//     CANCELLED: "Order cancelled successfully."
// }



// const ORDERS = [
//     {
//         id: 1, 
//         userid: '',
//         eventid:1,
//         eventname: 'sunt aut facere',
//         city: 'Hyderabad', 
//         date: '2022-03-19', 
//         endtime: "18:04", 
//         starttime: "17:03", 
//         viptickets: "1", 
//         gatickets: "18",
//         status:"CONFIRMED",
//         createdDate:'2022-03-16',
//         modifiedDate: '',
//         totalprice : 400
//     },
//     {
//         id: 2, 
//         userid: '',
//         eventid:2,
//         eventname: 'qui est esse',
//         city: 'Bangalore', 
//         date: '2022-03-29', 
//         endtime: "18:04", 
//         starttime: "17:03", 
//         viptickets: "4", 
//         gatickets: "10",
//         status:"CONFIRMED",
//         createdDate:'2022-03-19',
//         modifiedDate: '',
//         totalprice : 500
//     }
// ]