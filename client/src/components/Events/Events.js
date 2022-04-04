import React from "react";
import { EMPTY_DATASET } from "../constants";
import Event from "./Event";

const Events = (props) =>{
    return (
        <div className="events">
            {props.events && props.events.length ? 
                props.events.map(event=>{
                    return <Event key={event._id} event={event}/>
                })
            : <p> {EMPTY_DATASET.NO_DATA} </p>
        }
        </div>
    )
}

export default Events