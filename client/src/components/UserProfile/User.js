import React, { Component } from "react";
import Notification from "../Notifications/Notification";
import axios from "axios";
import { SessionContext } from "../SessionCookie/SessionCookie";
import Update from "./Update";
import UpdatePswd from "./UpdatePswd";

const ERRORS = {
  PASSWORD:
    "Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character '#?!@$%^&*-_'.",
  CONFIRM_PASSWORD: "Passowrd and confirm password does not match.",
  GENERIC_FAILED: "Oops! Something went wrong. Please try again.",
  UPDATE_FAILED: "Updation failed!",
};
const NOTIFICATIONS = {
  UPDATE_SUCCESS: "Successfully Updated the details!",
};
class User extends Component {
  constructor() {
    super();
    this.state = {
      isUpdatePwd: false,
      firstname: "",
      lastname: "",
      email: "",
      password: {
        value: "",
        isValid: false,
        isConfirm: false,
      },
      currPassword: {
        value: "",
        isValid: false,
      },
      user: null,
      errorMessages: [],
      notifications: [],
    };
    this.onPwdChange = this.onPwdChange.bind(this);
    this.onCurrPwdChange = this.onCurrPwdChange.bind(this);
    this.onConfirmPwd = this.onConfirmPwd.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFNChange = this.onFNChange.bind(this);
    this.onLNChange = this.onLNChange.bind(this);
    this.onCloseNotification = this.onCloseNotification.bind(this);
    this.onUpdatePwdClick = this.onUpdatePwdClick.bind(this);
  }
  static contextType = SessionContext;

  onCurrPwdChange(event) {
    var pwd = event.target.value;
    var pattern = new RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,12}$/
    );
    // ^ represents the starting of the string.
    // (?=.*[a-z]) represent at least one lowercase character.
    // (?=.*[A-Z]) represents at least one uppercase character.
    // (?=.*\\d) represents at least one numeric value.
    // (?=.*[-+_!@#$%^&*., ?]) represents at least one special character.
    // . represents any character except line break.
    // + represents one or more times.
    //test for password length & matching pattern only in case of registration
    if (pwd.length >= 6 && pwd.length <= 12) {
      if (!pattern.test(pwd)) {
        console.log("Failed pattern");
        this.setState({
          ...this.state,
          currPassword: { value: "", isValid: false },
        });
      } else {
        console.log("Success");
        this.setState({
          ...this.state,
          currPassword: { value: pwd, isValid: true },
        });
      }
    } else {
      console.log("Failed length");
      this.setState({
        ...this.state,
        currPassword: { value: "", isValid: false },
      });
    }
  }

  onPwdChange(event) {
    var pwd = event.target.value;
    var pattern = new RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,12}$/
    );
    // ^ represents the starting of the string.
    // (?=.*[a-z]) represent at least one lowercase character.
    // (?=.*[A-Z]) represents at least one uppercase character.
    // (?=.*\\d) represents at least one numeric value.
    // (?=.*[-+_!@#$%^&*., ?]) represents at least one special character.
    // . represents any character except line break.
    // + represents one or more times.
    //test for password length & matching pattern only in case of registration
    if (pwd.length >= 6 && pwd.length <= 12) {
      if (!pattern.test(pwd)) {
        console.log("Failed pattern");
        this.setState({
          ...this.state,
          password: { value: "", isValid: false },
        });
      } else {
        console.log("Success");
        this.setState({
          ...this.state,
          password: { value: pwd, isValid: true },
        });
      }
    } else {
      console.log("Failed length");
      this.setState({
        ...this.state,
        password: { value: "", isValid: false },
      });
    }
  }

  onConfirmPwd(event) {
    var confirmPwd = event.target.value;
    var pwd = this.state.password;
    if (pwd.isValid && confirmPwd === pwd.value) {
      this.setState({
        ...this.state,
        password: { ...this.state.password, isConfirm: true },
        errorMessages: [],
      });
    } else {
      this.setState({
        ...this.state,
        password: {
          ...this.state.password,
          isConfirm: false,
          errorMessages: [],
        },
      });
    }
  }

  onFNChange(event) {
    var FN = event.target.value;
    if (FN.length >= 3) this.setState({ ...this.state, firstname: FN });
  }
  onLNChange(event) {
    var LN = event.target.value;
    if (LN.length >= 3) this.setState({ ...this.state, lastname: LN });
  }
  onFormSubmit(event) {
    event.preventDefault();
    var { firstname, lastname, isUpdatePwd, currPassword, password, email } =
      this.state;
    var errorMessages = [];
    var notifications = [];

    if (!isUpdatePwd) {
      var data = JSON.stringify({
        fname: firstname || this.context.getUser().firstname,
        lname: lastname || this.context.getUser().lastname,
        email: email || this.context.getUser().email,
      });
      axios
        .put("/api/v1/user", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            notifications.push(NOTIFICATIONS.UPDATE_SUCCESS);
            this.setState({
              ...this.state,
              notifications,
              firstname: res.data.fname,
              lastname: res.data.lname,
              email: res.data.email,
            });
            // let { setUser } = this.context;

            // let token = "";
            // const user = {
            //   firstname: res.data.fname,
            //   lastname: res.data.lname,
            //   email: res.data.email,
            // };
            // setUser(user, token);
            // console.log(this.context.getUser());
          } else {
            errorMessages.push(ERRORS.UPDATE_FAILED);
            this.setState({
              ...this.state,
              errorMessages,
            });
          }
        })
        .catch((err) => {
          //Error
          errorMessages.push(ERRORS.UPDATE_FAILED);
          this.setState({
            ...this.state,
            errorMessages,
          });
        });
    } else {
      if (!password.isValid) errorMessages.push(ERRORS.PASSWORD);
      if (!password.isConfirm) errorMessages.push(ERRORS.CONFIRM_PASSWORD);
      if (errorMessages.length === 0) {
        var data1 = JSON.stringify({
          email: email || this.context.getUser().email,
          oldPassword: currPassword.value,
          password: password.value,
        });
        axios
          .put("/api/v1/user/passwordUpdate", data1, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              notifications.push(NOTIFICATIONS.UPDATE_SUCCESS);
              this.setState({
                ...this.state,
                notifications,
              });
            } else {
              errorMessages.push(ERRORS.UPDATE_FAILED);
              this.setState({
                ...this.state,
                errorMessages,
              });
            }
          })
          .catch((err) => {
            //Error
            errorMessages.push(ERRORS.UPDATE_FAILED);
            this.setState({
              ...this.state,
              errorMessages,
            });
          });
      }
    }
  }
  onCloseNotification(id, isError) {
    var { errorMessages, notifications } = this.state;
    if (isError) {
      errorMessages = errorMessages.filter((err, index) => index !== id);
      this.setState({ ...this.state, errorMessages });
    } else {
      notifications = notifications.filter(
        (notification, index) => index !== id
      );
      this.setState({ ...this.state, notifications });
    }
  }
  onUpdatePwdClick(value) {
    this.setState({
      isUpdatePwd: value,
    });
  }

  displayNotification(isError) {
    let { errorMessages, notifications } = this.state;
    var obj = isError ? errorMessages : notifications;
    return (
      <div className="notifications">
        {obj.map((item, index) => {
          return (
            <Notification
              key={index}
              isError={isError}
              id={index}
              message={item}
              onClose={this.onCloseNotification}
            />
          );
        })}
      </div>
    );
  }
  // componentDidMount() {
  //   console.log(this.context.getUser().email);
  //   var data = JSON.stringify({
  //     email: this.context.getUser().email,
  //   });
  //   console.log(data);
  //   axios
  //     .get("/api/v1/user", data, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         let { setUser } = this.context;

  //         let token = "";
  //         const user = {
  //           firstname: res.data.fname,
  //           lastname: res.data.lname,
  //           email: res.data.email,
  //         };
  //         setUser(user, token);
  //         console.log(this.context.getUser());
  //       } else {
  //         console.log("Error");
  //       }
  //     })
  //     .catch((err) => {
  //       //Error
  //       console.log(err);
  //     });
  // }

  render() {
    var { errorMessages, notifications, isUpdatePwd } = this.state;
    return (
      <div>
        {errorMessages.length ? this.displayNotification(true) : ""}
        {notifications.length ? this.displayNotification(false) : ""}

        <div className="form">
          <div className="form-header">
            {
              <>
                <label className={"tab-active"}>USER PROFILE</label>
              </>
            }
          </div>
          <div className="form-body">
            {!isUpdatePwd ? (
              <Update
                onFNChange={this.onFNChange}
                onLNChange={this.onLNChange}
                onFormSubmit={this.onFormSubmit}
                onUpdatePwdClick={this.onUpdatePwdClick}
              />
            ) : (
              <UpdatePswd
                onCurrPwdChange={this.onCurrPwdChange}
                onPwdChange={this.onPwdChange}
                onConfirmPwd={this.onConfirmPwd}
                onFormSubmit={this.onFormSubmit}
                onUpdatePwdClick={this.onUpdatePwdClick}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default User;
