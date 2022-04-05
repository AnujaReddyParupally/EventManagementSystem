import React, { Component } from 'react'

class ForgotPwd extends Component
{
    render(){
        const {displayOtp, isUserVerified} = this.props
        return(
            <form onSubmit={this.props.onForgotPwdSubmit}>
                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter email" name="uname" required 
                           onChange={this.props.onEmailChange}
                           disabled={this.props.displayOtp}
                                    />
                    {/* Display otp field only when email id exists in DB */}
                    {
                      !isUserVerified 
                      ?(displayOtp 
                        ? <>
                              <label htmlFor="otp"><b>OTP</b></label>
                              <input type="text" placeholder="Enter OTP" name="otp" 
                                  onChange={this.props.onOTPChange}/>
                              <span className='resend-otp' onClick={this.props.onSendOTPSubmit}>Resend OTP</span>
                          </>
                        : '')
                      : (
                      <div>
                          <label htmlFor="newpsw"><b>New password</b></label>
                          <input type="password" placeholder="Enter new password" name="newpsw" required 
                                maxLength={12} 
                                minLength={6}
                                onBlur={this.props.onPwdChange}/>

                          <label htmlFor="confirmnewpsw"><b>Confirm new password</b></label>
                          <input type="password" placeholder="Re-enter new password" name="confirmnewpsw" required 
                                maxLength={12} 
                                minLength={6}
                                onBlur={this.props.onConfirmPwd}/>
                      </div>
                      )
                    }
                   
                    {isUserVerified 
                    ? <button type="submit" className='btn-login'>Reset pasword</button>
                    : (displayOtp
                      ? <button type="button" onClick={this.props.onVerifyOTPSubmit} className='btn-login'>Verify</button>
                      : <button type="button" onClick={this.props.onSendOTPSubmit} className='btn-login'>Send OTP</button>)
                    }
            </form>
        )
    }
}

export default ForgotPwd