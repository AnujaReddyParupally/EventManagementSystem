import React, { Component } from 'react'
import { FcOk } from "react-icons/fc";
import { IoIosCloseCircle } from "react-icons/io";
import { EMPTY_DATASET } from '../constants';

class OrdersHistory extends Component{
    constructor(){
        super()
        this.state={}
    }
    render(){
        let {orders} = this.props
        console.log(orders)
        return (
            <div className='orders-history'>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Event name</th>
                            <th>City</th>
                            <th>Date</th>
                            <th>Starts at</th>
                            <th>Ends at</th>
                            <th>VIP tickets booked</th>
                            <th>General tickets booked</th>
                            <th>Amount paid</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 
                          ? <tr>
                              <td colSpan="10">
                                  {EMPTY_DATASET.NO_ORDERS}
                              </td> 
                            </tr>
                          : orders.map(order => {
                            return (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.eventname}</td>
                                    <td>{order.city}</td>
                                    <td>{order.date}</td>
                                    <td>{order.starttime}</td>
                                    <td>{order.endtime}</td>
                                    <td>{order.viptickets}</td>
                                    <td>{order.gatickets}</td>
                                    <td>{order.totalprice}</td>
                                    <td title={order.status.toUpperCase()}>{order.status !== 'Cancelled' ? <span className='tick'><FcOk/></span> : <span className='cross'><IoIosCloseCircle/></span>}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default OrdersHistory