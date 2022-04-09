import React, { Component } from "react";

class BookingForm extends Component{

    render(){
        let {date, slots, vip, ga, onFormSubmit, onEventDateChange, onStartsAtChange, onGaTicketsChange, onVipTicketsChange} = this.props
        const slot_dates = [], slot_times =[]
        return(
            <form onSubmit={onFormSubmit}>
                <div className="ddbooking">
                    <div>
                        <label><b>Event day:</b></label>
                        <select required onChange={onEventDateChange}>
                        <option value="">Select day</option>
                            {slots.map((slot)=>{
                                if(slot_dates.indexOf(slot.date) === -1)
                                {
                                    //UNIQUE DATES
                                    slot_dates.push(slot.date)
                                    return <option key={slot._id} value={slot.date}>{slot.date}</option>
                                }
                                else{
                                    return null
                                }
                            })}
                        </select>
                    </div>                     
                    <div>
                        <label><b>Starts at:</b></label>
                        <select required onChange={onStartsAtChange }>
                            <option value="">Select time</option>
                            {slots.map((slot)=>{
                                if(slot_times.indexOf(slot.time) === -1)
                                {
                                    //UNIQUE DATES
                                    slot_dates.push(slot.date)
                                    if(slot.date === date)
                                    return <option key={slot._id} value={slot.starttime}>{slot.starttime}</option>
                                }
                                else
                                 return null
                            })}
                        </select>
                    </div>
                </div>
                <div className="ticketsbooking">
                    <div>
                        <label>
                            <b>VIP tickets: </b> 
                            <span>({vip} tickets left)</span>
                        </label>    
                        <div>
                        <input type="number" name="viptickets" min={0} max={vip}
                            defaultValue={0}
                            className="number-input"
                            onBlur={onVipTicketsChange}></input>
                        </div>
                    </div>
                    <div>
                        <label>
                            <b>General Admission: </b> 
                            <span>({ga} tickets left)</span>
                        </label>  
                        <div>   
                        <input type="number" name="gatickets" min={0} max={ga}
                            defaultValue={0}
                            className="number-input"
                            onBlur={onGaTicketsChange}></input>
                        </div>
                    </div>   
                </div>
                <button type="submit" className="btn-book-ticket">Book Tickets</button>
            </form>
        )
    }
}

export default BookingForm