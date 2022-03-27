import React, { Component } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../SessionCookie/SessionCookie";

class Update extends Component {
  constructor() {
    super();
    this.onUpdatePwdClick = this.onUpdatePwdClick.bind(this);
  }
  static contextType = SessionContext;
  onUpdatePwdClick(value) {
    this.props.onUpdatePwdClick(value);
  }

  render() {
    let user = this.context.getUser();
    console.log(user.firstname);
    return (
      <form onSubmit={this.props.onFormSubmit}>
        <label htmlFor="fname">
          <b>First name</b>
        </label>
        <input
          type="text"
          placeholder="Enter first name"
          defaultValue={user.firstname}
          name="fname"
          required
          onChange={this.props.onFNChange}
          minLength={3}
        />

        <label htmlFor="fname">
          <b>Last name</b>
        </label>
        <input
          type="text"
          placeholder="Enter last name"
          defaultValue={user.lastname}
          name="lname"
          required
          onChange={this.props.onLNChange}
          minLength={3}
        />

        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input type="text" value={user.email} name="email" readOnly={true} />
        <button type="submit" className="btn-login">
          Update User Info
        </button>
        <Link to="/user">
          <button
            type="button"
            className="btn-login"
            onClick={() => this.onUpdatePwdClick(true)}
          >
            Change Password ?
          </button>
        </Link>
      </form>
    );
  }
}

export default Update;
