import React, { Component } from "react";
import axios from 'axios'
import Notification from "../Notifications/Notification";
import Spinner from "../Spinner/Spinner";
import {  SessionContext } from "../SessionCookie/SessionCookie";
import WithRouter from "../HOC/WithRouter";
import {ERRORS, NOTIFICATIONS} from '../constants.js'

const CITIES=[
    {id: 1, name: 'Hyderabad'},
    {id: 2, name: 'Bangalore'},
    {id: 3, name: 'Delhi'},
    {id: 4, name: 'Mumbai'}
]
// const ERRORS={
//     INVALID_EVNET: "Event name must have a minimum of 3 characters!"
//     ,INVALID_DESC: "Event description must have a minimum of 5 characters!"
//     ,INVALID_CITY: "City is required!"
//     ,INVALID_SLOT: "A slot must have a valid date, start time, end time, and must have atleast 1 GA ticket!"
//     ,INVALID_PRICE: "Price is required!"
//     ,INVALID_VIP_PRICE: "Price for VIP slots is required!"
//     ,INVALID_MAX_TICKETS: "Maximum bookings cannot be 0!"
//     ,INVALID_IMAGEURL: "Image URL is required!"
//     ,EVENT_ADDITION_FAILED: "Oops! Something went wrong while creating event."
// }

// const NOTIFICATIONS={
//     EVENT_SAVE_SUCCESS:"Event saved successfully!"
//     ,EVENT_ALREADY_EXISTS: "Event already exists!"
//     ,EVENT_EDIT_SUCCESS: "Event update successfully!",
// }
const SLOT_PROPS={DATE:'DATE',START:'STARTTIME',END:'ENDTIME',VIP:'VIP',GA:'GA'}

class AddEvent extends Component{
    constructor(){
        super()
        this.state={
           event:{
                // eventname:'',
                // city:[],
                // description:'',
                // tags:[],
                // ImageURL:'',
                // slots:[
                //     {date: '', starttime:'', endtime:'', viptickets:0, gatickets:0}
                // ],
                // VIPprice:0,
                // GAprice:0,
                // MaxTickets:0
            },
            errorMessages:[],
            notifications:[],
            cities:[],
            isLoading: true
        }
        this.tagref= React.createRef()
        this.onSlotAdd = this.onSlotAdd.bind(this)
        this.onSlotDelete = this.onSlotDelete.bind(this)
        this.onTagDelete=this.onTagDelete.bind(this)
        this.onTagAdd=this.onTagAdd.bind(this)
        this.onFormSubmit= this.onFormSubmit.bind(this)
        this.displayNotification= this.displayNotification.bind(this)
        this.onCloseNotification = this.onCloseNotification.bind(this)
    }
    static contextType = SessionContext
    onTagAdd(){
        let {tags} = this.state.event
        let tagvalue= this.tagref.current.value
        if(tagvalue.trim().length>0)
        {
            tags= tags.concat(tagvalue)
            this.setState({...this.state, event: {...this.state.event,tags}})
            this.tagref.current.value=""
        }
    }
    onTagDelete(deleteIndex){
        let {tags} = this.state.event
        tags= tags.filter((tag,index)=>{
            return index !== deleteIndex
        })
        this.setState({...this.state, event: {...this.state.event,tags}})
    }
    onSlotAdd(){
        let {slots} = this.state.event
        var newslot =   {date: '', starttime:'', endtime:'', viptickets:0, gatickets:0}
        slots= slots.concat(newslot)
        this.setState({...this.state, event: {...this.state.event, slots}})
    }
    onSlotDelete(deleteIndex){
        let {slots} = this.state.event
        slots= slots.filter((slot,index)=>{
            return index !== deleteIndex
        })
        this.setState({...this.state, event: {...this.state.event, slots}})
    }
    onCloseNotification(id, isError){
        var {errorMessages, notifications} = this.state
        if(isError){
            errorMessages =errorMessages.filter((err,index)=> index!==id)
            this.setState({...this.state, errorMessages})
        }
        else{
            notifications = notifications.filter((notification,index)=> index!==id)
            this.setState({...this.state, notifications})
        }
    }
    displayNotification(isError){
        let {errorMessages, notifications}= this.state
        var obj = isError ? errorMessages : notifications
        return ( 
                <div className='notifications'>      
                    {obj.map((item,index)=>{
                    return  <Notification key={index} 
                                            isError={isError}
                                            id={index}
                                            message={item}
                                            onClose={()=>this.onCloseNotification(index,isError)}/>
                    })}
                </div> 
            )

    }
    onFormSubmit(event){
        event.preventDefault();
        const {navigate, params} = this.props 
        this.setState({...this.state, isLoading: true})
        let errorMessages=[], notifications=[]
        let {_id, eventname, description, city, ImageURL, tags, slots, VIPprice, GAprice, MaxTickets} = this.state.event

        if(eventname.length < 3) errorMessages.push(ERRORS.INVALID_EVNET)
        if(description.length < 5) errorMessages.push(ERRORS.INVALID_DESC)
        if(city.length === 0) errorMessages.push(ERRORS.INVALID_CITY)
        if(ImageURL.length === 0) errorMessages.push(ERRORS.INVALID_IMAGEURL)

        //Validate slots
        let filteredslots= slots.filter(slot=>{
                return !(slot.date 
                         && slot.starttime 
                         && slot.endtime 
                         && (new Date ('1/1/1999 ' + slot.starttime) < new Date ('1/1/1999 ' + slot.endtime)) 
                         && (slot.gatickets || slot.viptickets))
            })
        if(filteredslots.length) errorMessages.push(ERRORS.INVALID_SLOT)
       
        //VIP Price cannot be zero when atleast one Slot has 1 or more  VIP tickets 
        //GA Price cannot be zero when atleast one Slot has 1 or more  GA tickets 
        let filteredVIPslots = slots.filter(slot=>{
            return slot.viptickets !== 0
        })
        let filteredGAslots = slots.filter(slot=>{
            return slot.gatickets !== 0
        })
        if((filteredVIPslots.length && VIPprice <= 0) || (filteredGAslots.length && GAprice <= 0)) errorMessages.push(ERRORS.INVALID_PRICE)
        
        // if(gaprice <= 0) errorMessages.push(ERRORS.INVALID_PRICE)
        if(MaxTickets <= 0) errorMessages.push(ERRORS.INVALID_MAX_TICKETS)

        if(errorMessages.length === 0)
        {
            /**SUCCESS: API - to save event data in events schema
             *                if event is saved, return 200 => display 'Event saved successfully!'
             * FAILURE: API - if event name already exists, return 409 => display 'Event already exists'
             * ERROR: if error, return 500 => display 'Opps! something went wrong.....'
            */

             var data = JSON.stringify({
                eventname: eventname, 
                city: city[0], 
                description: description, 
                tags: tags, 
                VIPprice: VIPprice, 
                GAprice: GAprice, 
                MaxTickets: MaxTickets,
                ImageURL: ImageURL,
                slots: slots,
            });

            if(_id)
            {
                //EDIT EVENT
                axios
                .put('/api/v1/events/admin/edit/' + _id, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ this.context.getToken()
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        //Success:
                        notifications.push(NOTIFICATIONS.EVENT_EDIT_SUCCESS)
                        let emptyState = this.getEmptyState()
                        this.setState({...emptyState, notifications, isLoading: false})
                        //Navigate to updated event details page
                        navigate('/events/details/'+params.id)
                    } 
                })
                .catch((err) =>{
                        //Failure
                        errorMessages.push(ERRORS.EVENT_EDIT_FAILED);
                        this.setState({errorMessages});
                })
            }
            else{
                //CREATE NEW EVENT
                axios
                .post("/api/v1/events/admin/add", data, {
                    headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer '+ this.context.getToken()
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                    //Success:
                        notifications.push(NOTIFICATIONS.EVENT_SAVE_SUCCESS)
                        let emptyState = this.getEmptyState()
                        this.setState({...emptyState, notifications, isLoading: false})
                        //RESET FORM INPUTS ON SUCCESSFUL EVENT CREATE
                        document.getElementById("add-event-form").reset();
                    } 
                })
                .catch((err) =>{
                    console.log(err)
                    if (err.response.status === 409) {
                        //Failure
                        errorMessages.push(NOTIFICATIONS.EVENT_ALREADY_EXISTS);
                        this.setState({
                        ...this.state,
                        errorMessages,
                        notifications: [],
                        isLoading: false
                        });
                    } else {
                        //Failure
                        errorMessages.push(ERRORS.EVENT_ADDITION_FAILED);
                        this.setState({
                        ...this.state,
                        errorMessages,
                        notifications: [],
                        isLoading: false
                        });
                    }
                })
            }
        }
        else{
            this.setState({...this.state, errorMessages, notifications:[], isLoading: false})
        }
    }
    getEmptyState(){
        return {
            event: {
                _id: '',
                eventname:'',
                city:'',
                description:'',
                ImageURL:'',
                tags:[],
                slots:[
                    {date: '', starttime:'', endtime:'', viptickets:0, gatickets:0}
                ],
                VIPprice:0,
                GAprice:0,
                MaxTickets:0
            },
            errorMessages:[],
            notifications:[]
        }
    }
    onSlotChange(event, index, slotProperty){
        let value= event.target.value
        let {slots} = this.state.event
        let currentSlot= slots[index]
        switch(slotProperty){
            case SLOT_PROPS.DATE:
                currentSlot.date= value
                break;
            case SLOT_PROPS.START:
                currentSlot.starttime= value
                break;
            case SLOT_PROPS.END:
                currentSlot.endtime= value
                break;
            case SLOT_PROPS.VIP:
                currentSlot.viptickets= value
                break;
            case SLOT_PROPS.GA:
                currentSlot.gatickets= value
                break;
            default: break;
        }
    }
    componentDidMount(){
        let id = this.props.params.id;
        let errorMessages = [], notifications =[]
        let cities = CITIES.sort((a,b)=> a.name> b.name ? 1 : -1)
        if(id)
        {
            axios.get(`/api/v1/events/${id}`, {
                headers: {
                    'Authorization': 'Bearer '+ this.context.getToken()
                }
            })
            .then(res=>{
                console.log(res.data)
                this.setState({...this.state, event: {...res.data}, cities, isLoading: false})     
            })
            .catch(err=>{
                errorMessages.push(ERRORS.GENERIC_FAILED)
                this.setState({...this.state, errorMessages, notifications:[], isLoading: false})
            })
        }
        else{
            let emptyState = this.getEmptyState()
            this.setState((prevState)=> ({...emptyState, cities, isLoading: !prevState.isLoading}))
        }
        
        
    }
    render(){
        let {_id, eventname, city, description, ImageURL, MaxTickets, slots, VIPprice, GAprice, tags} = this.state.event
        city = city && city.length ? city[0] : ''
        let {errorMessages, notifications, isLoading, cities} = this.state
        return(
            <div>
                {errorMessages.length ? this.displayNotification(true) :""}
                {notifications.length ? this.displayNotification(false) :""}   
                <Spinner show={isLoading}/>
            
                <div className="addevent">
                    <div>
                        {/* <img src="assets/images/addevent.jpg" alt=""></img> */}
                    </div>
                    <form onSubmit={this.onFormSubmit} id="add-event-form">
                        <div className="col-75">
                            <label htmlFor="eventname"><b>Event name</b></label>
                            <input type="text" 
                                placeholder="Enter event name" 
                                name="eventname" 
                                onBlur={event => this.setState({...this.state, event:{...this.state.event,eventname: event.target.value}})}
                                required
                                defaultValue={eventname}
                                minLength={3}/>
                        </div>
                        <div className="col-75">
                            <label htmlFor="city"><b>City</b></label>
                            <div>
                            <select required
                                    value={city }
                                    onChange={event => this.setState({...this.state, event: {...this.state.event, city: [event.target.value]}})}>
                                <option value="">Select city</option>
                                {cities.map((c,index)=>{
                                    return  <option key={index} value={c.name}>{c.name}</option>
                                })}
                            </select>
                        </div>
                        </div>

                        <div className="col-75">
                            <label htmlFor="desc"><b>Description</b></label>
                            <textarea name="desc" rows="4" cols="100" style={{resize:"none"}} 
                                    maxLength={1000} 
                                    onBlur={event => this.setState({...this.state, event: { ...this.state.event, description: event.target.value}})}
                                    required
                                    defaultValue={description}
                                    minLength={5}></textarea>
                        </div>
                        <div className="col-75">
                            <label htmlFor="imgUrl"><b>Image URL</b></label>
                            <input type="text" 
                                placeholder="Enter image URL" 
                                name="imgUrl" 
                                onBlur={event => this.setState({...this.state, event: {...this.state.event, ImageURL: event.target.value}})}
                                required
                                defaultValue={ImageURL}
                                minLength={3}/>
                        </div>
                        <div  style={{marginBottom: "10px"}} className="col-75">
                            <label htmlFor="tags"><b>Tags</b></label>
                            <span>(Optional)</span>
                            <div style={{display:"flex"}}>
                                <input type="text" 
                                    placeholder="Enter tags" 
                                    name="tags" 
                                    className="col-75" 
                                    ref={this.tagref}/>
                                <button type="button" 
                                        className='btn-login col-25'
                                        onClick={this.onTagAdd}>Add tag</button>
                            </div>
                            <div className="event-tag">
                                {tags && tags.map((tag,index)=>{
                                    return <p key={index}>{tag} 
                                            <span onClick={()=>this.onTagDelete(index)}>&times;</span>
                                        </p>
                                })}
                            </div>
                        </div>

                        <label><b>Slots</b></label>
                        <table>
                            <thead>
                                <tr>
                                    <td>Date</td>
                                    <td>Starts At</td>
                                    <td>Ends At</td>
                                    <td>Tickets (VIP)</td>
                                    <td>Tickets (GA)</td>
                                </tr>
                            </thead>
                            <tbody>
                                {slots && slots.map((slot,index)=>{
                                    let {viptickets, gatickets} = slot
                                    return  <tr key={index}>
                                    <td><input type="date" name="date" 
                                            defaultValue={slot.date}
                                            required
                                            onBlur={(event)=>this.onSlotChange(event, index,SLOT_PROPS.DATE)}></input></td>
                                    <td><input type="time" name="starttime" 
                                            defaultValue={slot.starttime}
                                            required
                                            onBlur={(event)=>this.onSlotChange(event, index,SLOT_PROPS.START)}></input></td>
                                    <td><input type="time" name="endtime" 
                                            defaultValue={slot.endtime}
                                            required
                                            onBlur={(event)=>this.onSlotChange(event, index,SLOT_PROPS.END)}></input></td>
                                    <td><input type="number" name="vip" 
                                            className="number-input"
                                            defaultValue={viptickets} 
                                            min={0} 
                                            onBlur={(event)=>this.onSlotChange(event, index,SLOT_PROPS.VIP)}required></input></td>
                                    <td><input type="number" name="ga"
                                            className="number-input" 
                                            defaultValue={gatickets} 
                                            min={0} 
                                            onBlur={(event)=>this.onSlotChange(event, index,SLOT_PROPS.GA)}required></input></td>
                                    <td>
                                    {index === slots.length - 1
                                    ? <span className="add" id="add" onClick={this.onSlotAdd}>&#43;</span>
                                    : ''
                                    }
                                    {slots.length === 1 
                                      ? '' 
                                      : <span className="add" id="minus" onClick={()=>this.onSlotDelete(index)}>&#8722;</span>
                                    }
                                </td>
                                    
                                </tr>
                                })}
                            
                            </tbody>
                        </table>

                        <label><b>Maximum numbers of bookings allowed per person:</b></label>
                        <input type="number" name="maxtickets" 
                            min={0}
                            defaultValue={MaxTickets} 
                            className="number-input"
                            onBlur={(event)=>this.setState({...this.state, event: {...this.state.event, MaxTickets:event.target.value}})}></input>
                        <div>
                            <label><b>Price</b></label>
                            <span>(INR) </span>
                        </div>
                        <span>VIP: </span>
                        <input type="number" name="vipprice" 
                               step=".01"  
                               min= {0}
                               className="number-input"
                               defaultValue={VIPprice}
                               onBlur={(event)=>this.setState({...this.state, event: {...this.state.event, VIPprice:event.target.value}})}></input>
                        <span>GA: </span>
                        <input type="number" name="gaprice" 
                               step=".01" 
                               min= {0}
                               className="number-input"
                               defaultValue={GAprice}
                               onBlur={(event)=>this.setState({...this.state, event: {...this.state.event, GAprice:event.target.value}})}></input>

                        <div className="btn-group">
                            <button type="submit" className='btn-login'>Save</button>
                            <button type="reset" className='btn-reset'>Reset</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default WithRouter(AddEvent)