import React, { Component } from "react";
import AddEvent from "./AddEvent";
import { Navigate } from "react-router-dom";
import {  SessionContext } from "../SessionCookie/SessionCookie";
class Admin extends Component{
    static contextType = SessionContext
    render(){
        return(
        <>
            {!this.context.getUser() && (<Navigate to="/login" replace={true}/>)}
            <div className="admin">
                <h3>Add Event</h3>
                <div className="admin-body">
                 <AddEvent/>
                </div>
            </div>
        </>
        )
    }
}

export default Admin