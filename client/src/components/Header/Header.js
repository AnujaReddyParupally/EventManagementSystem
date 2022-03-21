import React from 'react'
import {BiPowerOff} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { SessionConsumer } from '../SessionCookie/SessionCookie'

const Header = () =>{
    return (
        <nav className='navbar'>
            
            <SessionConsumer>
                {
                    context => {
                        let userctx= context.getUser()
                        return (
                            <>
                            <div style={{display:"flex"}}>
                                <div className='navbar-brand'><Link to="/events">Event Management System</Link></div>
                                <div className='navbar-menu'><Link to='/events'>All events</Link></div>
                                {userctx ? <div className='navbar-menu'><Link to='/events'>My Orders</Link></div> : ''}
                                {userctx && userctx.role ? <div className='navbar-menu'><Link to='/admin'>Admin</Link></div> : ''}
                            </div>
                            {
                                userctx
                                ? <div>
                                        <div className='navbar-user'><Link to='/logout'><BiPowerOff/></Link></div>
                                        <div className='navbar-user'>{userctx.firstname }</div>
                                  </div>
                                : <div className='navbar-user' title='Login'><Link to='/login'>Login</Link></div>
                            }
                            </>
                        )
                    }
                }
            </SessionConsumer>
        </nav>
    )
}

export default Header