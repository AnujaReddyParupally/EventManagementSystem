import React, {Component} from "react";
import { BsPencilFill } from "react-icons/bs";
import { BiAlarm, BiCalendar } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Navigate } from "react-router-dom";

import EventBooking from "../BookTickets/EventBooking";
import {  SessionContext } from "../SessionCookie/SessionCookie";
const DUMMY_EVENT=  {   
        id:1, 
        title: 'sunt aut facere',
        city:'Hyderabad',
        image:'event1.jpeg', 
        tags:['sunt','facere','optio'],
        description: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto. ',
        slots:[
            {date: "2022-03-19", endtime: "18:04", gatickets: "18", starttime: "17:03", viptickets: "1", availablegatickets: "10", availableviptickets: "0"},
            {date: "2022-03-20", endtime: "19:04", gatickets: "33", starttime: "18:04", viptickets: "7", availablegatickets: "0", availableviptickets: "2"}
        ],
        maxTickets: 7,
        vipprice:10,
        gaprice:40,

    }

class EventDetails extends Component{
    constructor(props){
        super(props)
        this.state={
        };
        this.onEventDelete = this.onEventDelete.bind(this)
        this.onEventEdit = this.onEventEdit.bind(this)
    }
    
    static contextType = SessionContext
    componentDidMount(){
        //API - get event based on id
        this.setState({...DUMMY_EVENT})
    }
    onEventDelete(eventid){
        console.log('delete',eventid)
    }
    onEventEdit(eventid){
        console.log('edit',eventid)
    }
    render(){
        let {id,title, city, image, description, tags, slots, maxTickets, vipprice, gaprice} = this.state
        return (
            <>
            {!this.context.getUser() && (<Navigate to="/login" replace={true}/>)}
            <div className="event-details">
                <h3>Event details</h3>
                {id ?
                <div className="body">
                    <div className="details">
                        <div style={{width: "250px"}}>
                            <img alt=""  src={"../assets/images/"+image}  />
                        </div>
                        <div className="details-data">
                            <p className="event-loc">{city}</p>
                            <h2>{title}</h2>
                            <div className="event-tag">
                                {
                                    tags.map((tag,index)=>{
                                    return  <p key={index}>{tag}</p>
                                    })
                                }
                            </div>
                            <div style={{marginTop: "10px"}}>{description}</div>
                            {this.context.getUser().role !== 0
                             ? <div className="admin-event-options">
                                <span onClick={()=>this.onEventEdit(id)}><BsPencilFill/></span>
                                <span onClick={()=>this.onEventDelete(id)}><RiDeleteBin6Fill/></span>
                               </div>
                             : ''}
                        </div>
                    </div>
                    <div style={{display: "flex",alignItems: "flex-end", flexDirection: "column"}}>
                        <div className="price">
                                <div>
                                    <span>VIP</span>
                                    <p><b>INR {vipprice}</b></p>
                                </div>
                                <div>
                                    <span>General (GA)</span>
                                    <p><b>INR {gaprice}</b></p>
                                </div>
                        </div>
                        <span>**You can book a maximum of {maxTickets} tickets.</span>
                    </div>
                    <div className="slot-booking">
                        <div className="slot-data">
                            {
                                slots.map((slot,index)=>{
                                    return <div className="slots" key={index}>
                                        <div>
                                            <h2><BiCalendar/></h2>
                                            <span>{new Date(slot.date).toDateString()}</span>
                                        </div>
                                        <div>
                                            <h2><BiAlarm/></h2>
                                            <span>{slot.starttime} - {slot.endtime}</span>
                                        </div>
                                        <div>
                                            <h2><strong>{slot.viptickets}</strong></h2>
                                            <span>VIP slots</span>
                                        </div>
                                        <div>
                                            <h2><strong>{slot.gatickets}</strong></h2>
                                            <span>General slots</span>
                                        </div>
                                        </div>
                                })
                            }
                        </div>
                        <div className="booking-form">
                            <EventBooking slots={slots} maxTickets={maxTickets} vipprice={vipprice} gaprice={gaprice}/>
                        </div>
                    </div>
                </div>
                :''
             }
         </div>
         </>
        )
    }
}

export default EventDetails