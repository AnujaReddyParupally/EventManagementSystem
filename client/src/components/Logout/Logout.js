import React, { Component } from "react";
import { SessionContext } from "../SessionCookie/SessionCookie";
import { BsFillFilePersonFill } from "react-icons/bs";
import { Link } from 'react-router-dom'
import { MESSAGES } from "../constants";
class Logout extends Component{
    static contextType = SessionContext
    componentDidMount(){
        this.context.logout()
    }
    render(){
        return (
            <div className="form logout">
                <BsFillFilePersonFill/>
                <p>{MESSAGES.LOGOUT}</p>
                <button className="btn-login"><Link to='/events'>Go back to events</Link></button>
            </div>
        )
    }
}

export default Logout