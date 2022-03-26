import React, { Component } from "react";
import axios from 'axios'
import Notification from "../Notifications/Notification";
import Spinner from "../Spinner/Spinner";
const CITIES=[
    {id: 1, name: 'Hyderabad'},
    {id: 2, name: 'Bangalore'},
    {id: 3, name: 'Delhi'},
    {id: 4, name: 'Mumbai'}
]
const ERRORS={
    INVALID_EVNET: "Event name must have a minimum of 3 characters!"
    ,INVALID_DESC: "Event description must have a minimum of 5 characters!"
    ,INVALID_CITY: "City is required!"
    ,INVALID_SLOT: "A slot must have a valid date, start time, end time, and must have atleast 1 GA ticket!"
    ,INVALID_PRICE: "Price is required!"
    ,INVALID_VIP_PRICE: "Price for VIP slots is required!"
    ,INVALID_MAX_TICKETS: "Maximum bookings cannot be 0!"
    ,INVALID_IMAGEURL: "Image URL is required!"
    ,EVENT_ADDITION_FAILED: "Oops! Something went wrong while creating event."
}

const NOTIFICATIONS={
    EVENT_SAVE_SUCCESS:"Event saved successfully!"
    ,EVENT_ALREADY_EXISTS: "Event already exists!"
}
const SLOT_PROPS={DATE:'DATE',START:'STARTTIME',END:'ENDTIME',VIP:'VIP',GA:'GA'}

class AddEvent extends Component{
    constructor(){
        super()
        this.state={
            eventname:'',
            city:'',
            description:'',
            tags:[],
            imageURL:'',
            slots:[
                {date: '', starttime:'', endtime:'', viptickets:0, gatickets:0}
            ],
            vipprice:0,
            gaprice:0,
            maxTickets:0,
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
    onTagAdd(){
        let {tags} = this.state
        let tagvalue= this.tagref.current.value
        if(tagvalue.trim().length>0)
        {
            tags= tags.concat(tagvalue)
            this.setState({...this.state, tags})
            this.tagref.current.value=""
        }
    }
    onTagDelete(deleteIndex){
        let {tags} = this.state
        tags= tags.filter((tag,index)=>{
            return index !== deleteIndex
        })
        this.setState({...this.state, tags})
    }
    onSlotAdd(event){
        let {slots} = this.state
        var newslot =   {date: '', starttime:'', endtime:'', viptickets:0, gatickets:0}
        slots= slots.concat(newslot)
        this.setState({...this.state, slots})
    }
    onSlotDelete(deleteIndex){
        let {slots} = this.state
        slots= slots.filter((slot,index)=>{
            return index !== deleteIndex
        })
        this.setState({...this.state, slots})
    }
    onTagEnter(event){
        console.log(event.target.value)
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
        this.setState({...this.state, isLoading: true})
        let errorMessages=[], notifications=[]
        let {eventname, description, city, imageURL, slots, vipprice, gaprice, maxTickets} = this.state

        if(eventname.length < 3) errorMessages.push(ERRORS.INVALID_EVNET)
        if(description.length < 5) errorMessages.push(ERRORS.INVALID_DESC)
        if(city.length === 0) errorMessages.push(ERRORS.INVALID_CITY)
        if(imageURL.length === 0) errorMessages.push(ERRORS.INVALID_IMAGEURL)

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
        if((filteredVIPslots.length && vipprice <= 0) || (filteredGAslots.length && gaprice <= 0)) errorMessages.push(ERRORS.INVALID_PRICE)
        
        // if(gaprice <= 0) errorMessages.push(ERRORS.INVALID_PRICE)
        if(maxTickets <= 0) errorMessages.push(ERRORS.INVALID_MAX_TICKETS)

        if(errorMessages.length === 0)
        {
            /**SUCCESS: API - to save event data in events schema
             *                if event is saved, return 200 => display 'Event saved successfully!'
             * FAILURE: API - if event name already exists, return 409 => display 'Event already exists'
             * ERROR: if error, return 500 => display 'Opps! something went wrong.....'
            */

             var data = JSON.stringify({
                eventname: this.state.eventname, 
                city: this.state.city.name, 
                description: this.state.description, 
                tags: this.state.tags, 
                VIPprice: this.state.vipprice, 
                GAprice: this.state.gaprice, 
                MaxTickets: this.state.maxTickets,
                ImageURL: this.state.imageURL,
                slots: this.state.slots,
            });
            axios
              .post("/api/v1/admin/addevent", data, {
                headers: {
                  "Content-Type": "application/json",
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  //Success:
                    notifications.push(NOTIFICATIONS.EVENT_SAVE_SUCCESS)
                    let emptyState = this.getEmptyState()
                    this.setState({...emptyState, notifications, isLoading: false})
                } 
              })
              .catch((err) =>{
                if (err.response.status === 409) {
                    //Failure
                    errorMessages.push(NOTIFICATIONS.EVENT_ALREADY_EXISTS);
                    this.setState({
                      ...this.state,
                      errorMessages,
                      isLoading: false
                    });
                  } else {
                    //Failure
                    errorMessages.push(ERRORS.EVENT_ADDITION_FAILED);
                    this.setState({
                      ...this.state,
                      errorMessages,
                      isLoading: false
                    });
                  }
              })
        }
        else{
            this.setState({...this.state, errorMessages, isLoading: false})
        }
    }
    getEmptyState(){
        return {
            eventname:'',
            city:'',
            description:'',
            imageURL:'',
            tags:[],
            slots:[
                {date: '', starttime:'', endtime:'', viptickets:0, gatickets:0}
            ],
            vipprice:0,
            gaprice:0,
            maxTickets:0,
            errorMessages:[],
            notification:[]
        }
    }
    onSlotChange(event, index, slotProperty){
        let value= event.target.value
        let {slots} = this.state
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
        let cities = CITIES.sort((a,b)=> a.name> b.name ? 1 : -1)
        this.setState((prevState)=> ({...prevState, cities, isLoading: !prevState.isLoading}))
        
    }
    render(){
        let {isLoading, cities, eventname, city, description, imageURL, maxTickets, slots, vipprice, gaprice, errorMessages, notifications} = this.state
       console.log(slots)
        return(
            <div>
                {errorMessages.length ? this.displayNotification(true) :""}
                {notifications.length ? this.displayNotification(false) :""}   
                <Spinner show={isLoading}/>
                <div className="addevent">
                    <div>
                        <img src="assets/images/addevent.jpg" alt=""></img>
                    </div>
                    <form onSubmit={this.onFormSubmit}>
                        <div className="col-75">
                            <label htmlFor="eventname"><b>Event name</b></label>
                            <input type="text" 
                                placeholder="Enter event name" 
                                name="eventname" 
                                onBlur={event => this.setState({...this.state, eventname: event.target.value})}
                                required
                                defaultValue={eventname}
                                minLength={3}/>
                        </div>
                        <div className="col-75">
                            <label htmlFor="city"><b>City</b></label>
                            <div>
                            <select required
                                    defaultValue={city}
                                    onChange={event => this.setState({...this.state, city: event.target.value})}>
                                <option value="">Select city</option>
                                {cities.map((city,index)=>{
                                    return  <option key={index} value={city.name}>{city.name}</option>
                                })}
                            </select>
                        </div>
                        </div>

                        <div className="col-75">
                            <label htmlFor="desc"><b>Description</b></label>
                            <textarea name="desc" rows="4" cols="100" style={{resize:"none"}} 
                                    maxLength={1000} 
                                    onBlur={event => this.setState({...this.state, description: event.target.value})}
                                    required
                                    defaultValue={description}
                                    minLength={5}></textarea>
                        </div>
                        <div className="col-75">
                            <label htmlFor="imgUrl"><b>Image URL</b></label>
                            <input type="text" 
                                placeholder="Enter image URL" 
                                name="imgUrl" 
                                onBlur={event => this.setState({...this.state, imageURL: event.target.value})}
                                required
                                defaultValue={imageURL}
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
                                {this.state.tags.map((tag,index)=>{
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
                                {slots.map((slot,index)=>{
                                    return  <tr key={index}>
                                    <td><input type="date" name="date" defaultValue={slot.date}
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
                                            defaultValue={slot.viptickets} 
                                            min={0} 
                                            onBlur={(event)=>this.onSlotChange(event, index,SLOT_PROPS.VIP)}required></input></td>
                                    <td><input type="number" name="ga"
                                            className="number-input" 
                                            defaultValue={slot.gatickets} 
                                            min={0} 
                                            onBlur={(event)=>this.onSlotChange(event, index,SLOT_PROPS.GA)}required></input></td>
                                    <td>
                                    {index === this.state.slots.length - 1
                                    ? <span className="add" id="add" onClick={this.onSlotAdd}>&#43;</span>
                                    : ''
                                    }
                                    {this.state.slots.length === 1 
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
                            min={0} defaultValue={maxTickets} 
                            className="number-input"
                            onBlur={(event)=>this.setState({...this.state, maxTickets:event.target.value})}></input>
                        <div>
                            <label><b>Price</b></label>
                            <span>(INR) </span>
                        </div>
                        <span>VIP: </span>
                        <input type="number" name="vipprice" 
                               step=".01"  
                               className="number-input"
                               defaultValue={vipprice}
                               onBlur={(event)=>this.setState({...this.state, vipprice:event.target.value})}></input>
                        <span>GA: </span>
                        <input type="number" name="gaprice" 
                               step=".01" 
                               className="number-input"
                               defaultValue={gaprice}
                               onBlur={(event)=>this.setState({...this.state, gaprice:event.target.value})}></input>

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

export default AddEvent