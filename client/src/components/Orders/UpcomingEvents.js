import React, { Component } from 'react'
import { EMPTY_DATASET } from '../constants'

class UpcomingEvents extends Component{
    constructor(){
        super()
        this.state={}
    }
    render(){
        let {events, onCancelOrder} = this.props
        console.log(events)
        return (<div className='upcoming-events'>
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {events.length === 0 
                   ?  <tr>
                              <td colSpan="10">
                                  {EMPTY_DATASET.NO_UPCOMING_EVENTS}
                              </td> 
                            </tr>
                 : events.map(event => {
                    return (
                        <tr key={event.id}>
                            <td>#{event.id}</td>
                            <td>{event.eventname}</td>
                            <td>{event.city}</td>
                            <td>{event.date}</td>
                            <td>{event.starttime}</td>
                            <td>{event.endtime}</td>
                            <td>{event.viptickets}</td>
                            <td>{event.gatickets}</td>
                            <td>{event.totalprice}</td>
                            <td><button type="button" className="btn-cancel-ticket" onClick={()=>onCancelOrder(event.id)}>Cancel order</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>)
    }
}

export default UpcomingEvents