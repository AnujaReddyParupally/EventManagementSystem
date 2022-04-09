import React from "react";

const Event = (props) =>{
    const {id, eventname, city, ImageURL, description, tags}= props.event
    return (
        <div className="event">
            <div className="event-img">
                <img src={"assets/images/"+ImageURL} />
            </div>
            <div className="event-body">
                <p className="event-loc">{city}</p>
                <h2 >{eventname}</h2>
                <h2 className="event-details" >{description}</h2>
                <div className="event-tag">
                    {tags.map((i,index)=>{
                    return  <p key={index}>{i}</p>
                    })}
                </div>
                <a href="#">View details &gt;</a>
            </div>
            
            
            {/* <p>{description}</p> */}
            
        </div>
    )
}

export default Event