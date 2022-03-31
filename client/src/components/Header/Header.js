import React from 'react'
import {BiPowerOff, BiUser} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { SessionConsumer } from '../SessionCookie/SessionCookie'

const Header = () =>{
    return (
        <nav className='navbar'>
            <SessionConsumer>
                {
                    context => {
                        let userctx= context.getUser()
                        console.log(userctx)
                        return (
                            <>
                            <div style={{display:"flex"}}>
                                <div className='navbar-brand'><Link to="/events">Event Management System</Link></div>
                                <div className='navbar-menu'><Link to='/events'>All events</Link></div>
                                {userctx ? <div className='navbar-menu'><Link to='/orders'>My orders</Link></div> : ''}
                                {userctx && userctx.role ? <div className='navbar-menu'><Link to='/admin'>Admin</Link></div> : ''}
                            </div>
                            {
                                userctx
                                ? <div>
                                        <div className='navbar-user'><Link to='/logout'><BiPowerOff/></Link></div>
                                        <div className="navbar-user"><Link to="/user"><BiUser /></Link></div>
                                        <div className='navbar-user'>{userctx.fname} {userctx.lname}</div>
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