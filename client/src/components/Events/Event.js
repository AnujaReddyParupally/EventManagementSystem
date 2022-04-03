import React from "react";
import { Link } from "react-router-dom";

const Event = (props) =>{
    const {_id, eventname, city, ImageURL, description, tags}= props.event
    return (
        <div className="event">
            <div className="event-img">
                <img src={window.location.origin+"/assets/images/"+ImageURL} />
            </div>
            <div className="event-body">
                <p className="event-loc">{city}</p>
                <h2 >{eventname}</h2>
                <div className="event-tag">
                    {tags.map((i,index)=>{
                    return  <p key={index}>{i}</p>
                    })}
                </div>
                <Link to={'/events/details/'+_id}>View details &gt;</Link>
            </div>
            
            
            {/* <p>{description}</p> */}
            
        </div>
    )
}

export default Event