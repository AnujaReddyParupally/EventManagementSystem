import React from 'react'
import {BiPowerOff} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { SessionConsumer } from '../SessionCookie/SessionCookie'

const Header = () =>{
    return (
        <nav className='navbar'>
            <div className='navbar-brand'>Event Management System</div>
            <SessionConsumer>
                {
                    context => {
                        let userctx= context.getUser()
                        console.log(userctx);
                        return (
                            <>
                            {
                                userctx
                                ? <div>
                                    <div className='navbar-user'><Link to='/logout'><BiPowerOff/></Link></div>
                                    <div className='navbar-user'>{userctx.user.fname}</div>
                                  </div>
                                : <div className='navbar-user'><Link to='/login'>Login</Link></div>
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