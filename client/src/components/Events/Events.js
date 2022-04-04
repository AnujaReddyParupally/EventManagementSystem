import React from "react";
import Event from "./Event";

const Events = (props) =>{
    console.log(props.events)
    return (
       
        <div className="events">
            {props.events.map(event=>{
                return <Event key={event._id} event={event}/>
            })}
        </div>
    )
}

export default Events