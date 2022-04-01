import axios from "axios";
import React, { Component } from "react";
import OrdersHistory from "./OrdersHistory";
import UpcomingEvents from "./UpcomingEvents";
import { SessionContext } from "../SessionCookie/SessionCookie";
import Notification from '../Notifications/Notification'

const ERRORS = {
    CANCELERROR: "Order is already cancelled. Please refresh the page"
}

const NOTIFICATIONS = {
    CANCELLED: "Order cancelled successfully. Please refresh the page"
}

class Orders extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            isOrderHistory: true,
            ordersHistory: [],
            upcomingEvents: [],
            orders: [],
            notifications: [],
            errorMessages: []
        }
        this.onCancelOrder = this.onCancelOrder.bind(this)
        this.onCloseNotification = this.onCloseNotification.bind(this)
    }

    static contextType = SessionContext

    onTabClick(value) {
        this.setState({ ...this.state, isOrderHistory: value })
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
    componentDidMount() {
        //TODO: API TO FETCH ALL ORDER
        let userid = this.context.getUser()._id;
        axios.get(`api/v1/order/user/${userid}`).then(res => {
            console.log(res.data);

            let orders = res.data.orders.map(order => {
                return {
                    id: order._id,
                    userid: order.userID._id,
                    eventid: order.eventID._id,
                    eventname: order.eventID[0].eventname,
                    city: order.eventID[0].city[0],
                    date: "04-01-2022", //order.eventID[0].slots[0].date,
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

        });
    }
    onCancelOrder(orderid) {
        /**TODO - API - SEND ORDER ID 
         *            - UPDATE ORDER STATUS TO CANCELLED
         *            - UPDATE AVAILABLE TICKETS IN EVENTS SCHEMA
        */
        var { errorMessages, notifications, orders, upcomingEvents } = this.state;

        axios.put(`api/v1/order/${orderid}`).then(res => {
            console.log(res.data);
            if (res.status === 200 && res.data) {
                notifications.push(NOTIFICATIONS.CANCELLED)
                const filteredorder = orders.find(o => o.id === orderid)
                filteredorder.status = "Cancelled"
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

    render() {
        let { isOrderHistory, ordersHistory, upcomingEvents, orders, errorMessages, notifications } = this.state
        console.log(orders)
        return (
            <>{
                orders.length === 0 ? '' :
                    <>
                        {errorMessages.length ? this.displayNotification(true) : ""}
                        {notifications.length ? this.displayNotification(false) : ""}
                        <div className="orders" >
                            <h3>My orders</h3>
                            <div className="body">
                                <div className="form-header">
                                    <label className={isOrderHistory ? 'tab-active' : ''}
                                        onClick={() => this.onTabClick(true)}>ORDERS HISTORY</label>
                                    <label className={!isOrderHistory ? 'tab-active' : ''}
                                        onClick={() => this.onTabClick(false)}>UPCOMING / ACTIVE EVENTS</label>
                                </div>
                                <div>
                                    {
                                        isOrderHistory
                                            ? <OrdersHistory orders={ordersHistory} />
                                            : <UpcomingEvents events={upcomingEvents} onCancelOrder={this.onCancelOrder} />
                                    }
                                </div>
                            </div>
                        </div>
                    </>
            }
            </>

        )
    }
}

export default Orders