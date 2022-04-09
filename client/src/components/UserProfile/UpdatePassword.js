import React, { Component } from "react";
import { Link } from "react-router-dom";

class UpdatePassword extends Component {
  constructor() {
    super();
    this.onUpdatePwdClick = this.onUpdatePwdClick.bind(this);
    this.onCurrPwdChange = this.onCurrPwdChange.bind(this);
  }

  onUpdatePwdClick(value) {
    this.props.onUpdatePwdClick(value);
  }

  onCurrPwdChange(value) {
    this.props.onCurrPwdChange(value);
  }

  render() {
    return (
      <form onSubmit={this.props.onFormSubmit}>
        <label htmlFor="currpsw">
          <b>Current Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Current password"
          name="currpsw"
          required
          maxLength={12}
          minLength={6}
          onBlur={this.props.onCurrPwdChange}
        />
        <label htmlFor="psw">
          <b>New Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          name="psw"
          required
          maxLength={12}
          minLength={6}
          onBlur={this.props.onPwdChange}
        />

        <label htmlFor="confirmpsw">
          <b>Confirm new password</b>
        </label>
        <input
          type="password"
          placeholder="Re-enter new password"
          name="confirmpsw"
          required
          maxLength={12}
          minLength={6}
          onBlur={this.props.onConfirmPwd}
        />
        <div style={{display:'flex'}}>
        <button type="submit" className="btn-login">
          Update New Password
        </button>
        {/* <Link to="/user"> */}
          <button
            type="button"
            className="btn-reset"
            onClick={() => this.onUpdatePwdClick(false)}
          >
            User Info
          </button>
        {/* </Link> */}
        </div>
      </form>
    );
  }
}

export default UpdatePassword;