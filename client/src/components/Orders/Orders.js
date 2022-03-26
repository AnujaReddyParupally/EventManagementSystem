import React, { Component } from "react";
import OrdersHistory from "./OrdersHistory";
import UpcomingEvents from "./UpcomingEvents";

const ORDERS = [
    {
        id: 1, 
        userid: '',
        eventid:1,
        eventname: 'sunt aut facere',
        city: 'Hyderabad', 
        date: '2022-03-19', 
        endtime: "18:04", 
        starttime: "17:03", 
        viptickets: "1", 
        gatickets: "18",
        status:"CONFIRMED",
        createdDate:'2022-03-16',
        modifiedDate: '',
        totalprice : 400
    },
    {
        id: 2, 
        userid: '',
        eventid:2,
        eventname: 'qui est esse',
        city: 'Bangalore', 
        date: '2022-03-29', 
        endtime: "18:04", 
        starttime: "17:03", 
        viptickets: "4", 
        gatickets: "10",
        status:"CONFIRMED",
        createdDate:'2022-03-19',
        modifiedDate: '',
        totalprice : 500
    }
]
class Orders extends Component{
    constructor(){
        super()
        this.state={
            isLoading:true,
            isOrderHistory: true,
            ordersHistory: [],
            upcomingEvents: []
        }
        this.onCancelOrder = this.onCancelOrder.bind(this)
    }
    onTabClick(value){
        this.setState({...this.state, isOrderHistory:value})
    }
    componentDidMount(){
        //TODO: API TO FETCH ALL ORDERS
        let ordersHistory = ORDERS.filter(order => {
            return (new Date (order.date + ' ' + order.endtime)) < new Date()
        })
        let upcomingEvents = ORDERS.filter(order => {
            return (new Date (order.date + ' ' + order.endtime)) > new Date()
        })
        this.setState({...this.state, isLoading: false, ordersHistory, upcomingEvents})
    }
    onCancelOrder(orderid){
        /**TODO - API - SEND ORDER ID 
         *            - UPDATE ORDER STATUS TO CANCELLED
         *            - UPDATE AVAILABLE TICKETS IN EVENTS SCHEMA
        */
         
    }
    render(){
        let {isOrderHistory, ordersHistory, upcomingEvents} = this.state
        return (
            <div className="orders">
                <h3>My orders</h3>
                <div className="body">
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
                </div>
            </div>
        )
    }
}

export default Orders