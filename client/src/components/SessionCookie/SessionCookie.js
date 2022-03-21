import React, { Component } from 'react'
import  Cookies from 'js-cookie'

class SessionContextProvider extends Component{
    constructor(){
        super()
        this.state={
            user:{},
            token:''
        }
        this.setUserSessionCookie=this.setUserSessionCookie.bind(this)
        this.getUserSessionCookie=this.getUserSessionCookie.bind(this)
        this.removeSessionCookie=this.removeSessionCookie.bind(this)
    }
    removeSessionCookie(){
        Cookies.remove("session")
        this.setState({...this.state, user: {}})
    }
    setUserSessionCookie(session, token){
        //Remove previous session and create new session that expires in 1 day
        Cookies.remove("session")
        this.setState({...this.state, user: session})
        Cookies.set("session",btoa(JSON.stringify(session)),{expires:1})
        console.log(session)
    }

    getUserSessionCookie(){
        const sessionCookie = Cookies.get("session");
        if (sessionCookie === undefined) {
          return null;
        } else {
          return JSON.parse(atob(sessionCookie));
        }
    }

    render(){
        return (
            <SessionProvider value={{...this.state, logout:this.removeSessionCookie, setUser: this.setUserSessionCookie, getUser: this.getUserSessionCookie}}>
                {this.props.children}
            </SessionProvider>
        )
    }
}

export default SessionContextProvider
//SESSION CONTEXT
export const SessionContext = React.createContext();
export const SessionProvider = SessionContext.Provider
export const SessionConsumer = SessionContext.Consumer