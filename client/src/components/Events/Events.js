import React from "react";
import Event from "./Event";

const Events = (props) =>{
    return (
        <div className="events">
            {props.events && props.events.length ? 
                props.events.map(event=>{
                    return <Event key={event._id} event={event}/>
                })
            : <p> No records found. </p>
        }
        </div>
    )
}

export default Events