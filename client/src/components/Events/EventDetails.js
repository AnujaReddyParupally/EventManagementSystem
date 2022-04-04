import React, {Component} from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import { BsPencilFill } from "react-icons/bs";
import { BiAlarm, BiCalendar } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Navigate } from "react-router-dom";

import EventBooking from "../BookTickets/EventBooking";
import {  SessionContext } from "../SessionCookie/SessionCookie";
import WithRouter from "../HOC/WithRouter";
import Spinner from "../Spinner/Spinner";
import {EMPTY_DATASET, ERRORS, NOTIFICATIONS} from '../constants.js'

class EventDetails extends Component{
    constructor(props){
        super(props)
        this.state={
            isLoading: true,
            event: {}
        };
        this.onEventDelete = this.onEventDelete.bind(this)
        this.onEventEdit = this.onEventEdit.bind(this)
    }
    
    static contextType = SessionContext
    componentDidMount(){
        this.setState({...this.state, isLoading: true})
        //This page is accessible only to logged in users
        const user = this.context.getUser()
        const token = this.context.getToken()
        //id comes from HOC withRouter
        const id = this.props.params.id
        let errorMessages = []
        if(user && token) {
            //API - get event based on id
            axios.get(`/api/v1/events/${id}`, {
                headers: {
                    'Authorization': 'Bearer '+ token
                }
            })
            .then(res=>{
                //console.log(res.data)
                this.setState({...this.state, event: {...res.data}, isLoading: false})     
            })
            .catch(err=>{
                console.log(err)
                errorMessages.push(ERRORS.GENERIC_FAILED)
                this.setState({...this.state, errorMessages, notifications:[], isLoading: false})
            })
        }
        else{
            this.setState({...this.state, errorMessages:[], notifications:[], isLoading: false})
        }
    }
    onEventDelete(eventid){
        console.log('delete',eventid)
        var errorMessages = [], notifications = []
        var {navigate} = this.props

        //API- Delete event 
        //Success: Display notification 'Event Successfully Deleted!'
        //Failure: Oops! Something went wrong. Please try again.

        console.log('Event Deletion Data', eventid);
        axios
            .delete('/api/v1/events/admin/delete/' + eventid, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ this.context.getToken()
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    //Success:
                    notifications.push(NOTIFICATIONS.EVENT_DELETE_SUCCESS)
                    this.setState({notifications})
                    navigate('/events')
                } 
            })
            .catch((err) =>{
                if (err.response.status === 409) {
                    //Failure
                    errorMessages.push(NOTIFICATIONS.EVENT_CONFLICTS);
                    this.setState({errorMessages});
                } else {
                    //Failure
                    errorMessages.push(ERRORS.EVENT_DELETION_FAILED);
                    this.setState({errorMessages});
                }
            })
    }
    onEventEdit(eventid){
        console.log('edit',eventid)
        const {navigate} = this.props
        navigate('/admin/'+eventid)
        /*
        *THIS CODE IS MOVED TO ADMIN ADD EVENT
        
        var {errorMessages, notifications} = this.state
        //API- edit event 
        //Success: Display notification 'Event Successfully Edited!'
        //Failure: Oops! Something went wrong. Please try again.

        //TODO: Assuming success
        var data = JSON.stringify({
            eventname: this.state.eventname, 
            city: this.state.city, 
            description: this.state.description, 
            tags: this.state.tags, 
            VIPprice: this.state.vipprice, 
            GAprice: this.state.gaprice, 
            MaxTickets: this.state.maxTickets,
            ImageURL: this.state.imageURL,
            slots: this.state.slots,
        });
        console.log('Event Edit Data', data);
        axios
            .put('/api/v1/events/admin/edit/' + eventid, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ this.context.getToken()
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    //Success:
                    notifications.push(NOTIFICATIONS.EVENT_EDIT_SUCCESS)
                    this.setState({notifications})
                } 
            })
            .catch((err) =>{
                if (err.response.status === 409) {
                    //Failure
                    errorMessages.push(NOTIFICATIONS.EVENT_CONFLICTS);
                    this.setState({errorMessages});
                } else {
                    //Failure
                    errorMessages.push(ERRORS.EVENT_EDIT_FAILED);
                    this.setState({errorMessages});
                }
            })
            */
    }
    render(){
        let {_id,eventname, city, ImageURL, description, tags, slots, MaxTickets, VIPprice, GAprice} = this.state.event
        return (
            <>
            {!this.context.getUser() && (<Navigate to="/login" replace={true}/>)}
            <Spinner isLoading={this.state.isLoading}/>
            <div className="event-details">
                <h3>Event details</h3>
                {_id  ?
                <div className="body">
                    <div className="details">
                        <div style={{width: "250px"}}>
                            <img alt=""  src={"/assets/images/"+ImageURL}  />
                        </div>
                        <div className="details-data">
                            <p className="event-loc">{city[0]}</p>
                            <h2>{eventname}</h2>
                            <div className="event-tag">
                                {
                                    tags.map((tag,index)=>{
                                    return  <p key={index}>{tag}</p>
                                    })
                                }
                            </div>
                            <div style={{marginTop: "10px"}}>{description}</div>
                            {this.context.getUser().role 
                             ? <div className="admin-event-options">
                                <span onClick={()=>this.onEventEdit(_id)}><BsPencilFill/></span>
                                <span onClick={()=>this.onEventDelete(_id)}><RiDeleteBin6Fill/></span>
                               </div>
                             : ''}
                        </div>
                    </div>
                    <div style={{display: "flex",alignItems: "flex-end", flexDirection: "column"}}>
                        <div className="price">
                                <div>
                                    <span>VIP</span>
                                    <p><b>INR {VIPprice}</b></p>
                                </div>
                                <div>
                                    <span>General (GA)</span>
                                    <p><b>INR {GAprice}</b></p>
                                </div>
                        </div>
                        <span>**You can book a maximum of {MaxTickets} tickets.</span>
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
                            <EventBooking eventID={this.props.params.id} slots={slots} maxTickets={MaxTickets} vipprice={VIPprice} gaprice={GAprice}/>
                        </div>
                    </div>
                </div>
                : !this.state.isLoading && <div className="body">
                    <div style={{textAlign:'center'}}>
                        <p>{EMPTY_DATASET.NO_EVENT_DATA}</p>
                        <button className="btn-login" style={{width:'250px'}}><Link to='/events'>Go back to events</Link></button>
                    </div>
                </div>
             }
         </div>
         </>
        )
    }
}

export default WithRouter(EventDetails)


// const ERRORS ={
//     EVENT_CONFLICTS: "Request conflict with the current state of the target resource.",
//     EVENT_DELETION_FAILED: "Event deletion failed!",
//     EVENT_EDIT_FAILED: "Event updation failed!",
//     GENERIC_FAILED: "Oops! Something went wrong. Please try again."
// }   

// const NOTIFICATIONS = {
//     EVENT_DELETE_SUCCESS: "Event deleted successfully!",
//     EVENT_EDIT_SUCCESS: "Event update successfully!",
// }

// const DUMMY_EVENT=  {   
//         _id:1, 
//         eventname: 'sunt aut facere',
//         city:['Hyderabad'],
//         ImageURL:'event1.jpeg', 
//         tags:['sunt','facere','optio'],
//         description: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto. ',
//         slots:[
//             {date: "2022-03-19", endtime: "18:04", gatickets: "18", starttime: "17:03", viptickets: "1", availablegatickets: "10", availableviptickets: "0"},
//             {date: "2022-03-20", endtime: "19:04", gatickets: "33", starttime: "18:04", viptickets: "7", availablegatickets: "0", availableviptickets: "2"}
//         ],
//         MaxTickets: 7,
//         VIPprice:10,
//         GAprice:40
//     }