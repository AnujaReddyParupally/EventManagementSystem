import React, { Component } from 'react'

class UpcomingEvents extends Component{
    constructor(){
        super()
        this.state={}
    }
    render(){
        let {events, onCancelOrder} = this.props
        return (<div className='upcoming-events'>
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => {
                    return (
                        <tr key={event.id}>
                            <td>#{event.id}</td>
                            <td>{event.eventname}</td>
                            <td>{event.city}</td>
                            <td>{event.date}</td>
                            <td>{event.starttime}</td>
                            <td>{event.endtime}</td>
                            <td>{event.viptickets}</td>
                            <td>{event.gaptickets}</td>
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