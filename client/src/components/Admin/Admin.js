import React, { Component } from "react";
import AddEvent from "./AddEvent";

class Admin extends Component{
    constructor(){
        super()
    }

    render(){
        //TODO: display only if user is authenticated
        return(
        <>
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