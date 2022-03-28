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
    setTokenCookie(token){
        //TOKEN NEEDS TO BE REFRESHED AFTER EXPIRY - CALL TOKEN API - FUTURE ENHANCEMENT
        Cookies.remove("auth")
        Cookies.set("auth",btoa(token.value),{expires:token.expiresAt / (24*60*60)})
        this.setState({...this.state, token})
        console.log(token)
    }

    getTokenCookie(){
        const tokenCookie = Cookies.get("auth");
        if (tokenCookie === undefined) {
          return null;
        } else {
          return atob(tokenCookie)
        }
    }

    setUserSessionCookie(session){
        //Remove previous session and create new session that expires in 1 day
        Cookies.remove("session")
        Cookies.set("session",btoa(JSON.stringify(session)),{expires:1})
        this.setState({...this.state, user: session})
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
        let operations = {
            logout:this.removeSessionCookie, 
            setUser: this.setUserSessionCookie, 
            getUser: this.getUserSessionCookie, 
            setToken: this.setTokenCookie,
            getToken: this.getTokenCookie
        }
        return (
            <SessionProvider value={{...this.state, ...operations}}>
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