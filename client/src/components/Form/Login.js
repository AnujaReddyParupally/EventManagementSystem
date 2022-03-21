import React, { Component } from 'react'

class Login extends Component{
    constructor(){
        super()
        this.onForgotPwdClick = this.onForgotPwdClick.bind(this)
    }
    onForgotPwdClick(value){
        this.props.onForgotPwdClick(value)
    }
    render(){
        return (
            <form onSubmit={this.props.onFormSubmit}>
                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter email" name="email" required 
                                       onChange={this.props.onEmailChange}
                                       />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter password" name="psw" required
                           onBlur={this.props.onPwdChange}/>

                    <button type="submit" className='btn-login'>Login</button>
                    <p className='forgot-pwd' onClick={()=>this.onForgotPwdClick(true)}>Forgot password?</p>
            </form>
        )
    }
}

export default Login