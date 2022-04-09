import React, { Component } from 'react'
import { FcOk } from "react-icons/fc";
import { IoIosCloseCircle } from "react-icons/io";

class OrdersHistory extends Component{
    constructor(){
        super()
        this.state={}
    }
    render(){
        let {orders} = this.props
        return (
            <div className='orders-history'>
                <table>
                    <thead>
                        <tr>
                            <th>Event name</th>
                            <th>City</th>
                            <th>Order ID</th>
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
                        {orders.map(order => {
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
                                    <td>{order.status === 'CONFIRMED' ? <span className='tick'><FcOk/></span> : <span className='cross'><IoIosCloseCircle/></span>}</td>
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