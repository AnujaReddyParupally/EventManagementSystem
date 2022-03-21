import React, { Component } from 'react'

class SignUp extends Component{
    constructor(){
        super()
        this.state={
         
        }
    }

    render(){
        return (
             <form onSubmit={this.props.onFormSubmit}>
                    <label htmlFor="fname"><b>First name</b></label>
                    <input type="text" placeholder="Enter first name" name="fname" required 
                           onChange={this.props.onFNChange}
                           minLength={3}/>

                    <label htmlFor="fname"><b>Last name</b></label>
                    <input type="text" placeholder="Enter last name" name="lname" required 
                           onChange={this.props.onLNChange}
                           minLength={3}/>

                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter email" name="email" required onChange={this.props.onEmailChange}/>

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter password" name="psw" required 
                           maxLength={12} 
                           minLength={6}
                           onBlur={this.props.onPwdChange}/>

                    <label htmlFor="confirmpsw"><b>Confirm password</b></label>
                    <input type="password" placeholder="Re-enter password" name="confirmpsw" required 
                           maxLength={12} 
                           minLength={6}
                           onBlur={this.props.onConfirmPwd}/>

                    <button type="submit" className='btn-login'>Register</button>
             </form>
        )
    }
}

export default SignUp