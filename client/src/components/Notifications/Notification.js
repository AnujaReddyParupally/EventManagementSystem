import React from "react";

const Notification = (props) => {
    const onCloseNotification =(id,isError) =>{
        props.onClose(id, isError)
    }
    return  (
        <div className={props.isError ? "alert alert-error" : "alert alert-success"} id={props.id}>
            <span className="closebtn" onClick={(event)=>onCloseNotification(props.id, props.isError)}>&times;</span> 
            {props.isError?<strong>Error!</strong> : <strong>Success!</strong>} {props.message}
        </div>
        )
    
}

export default Notification