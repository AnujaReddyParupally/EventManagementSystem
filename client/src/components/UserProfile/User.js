import React, { Component } from "react";
import Notification from "../Notifications/Notification";
import axios from "axios";
import { SessionContext } from "../SessionCookie/SessionCookie";
import UpdateUserInfo from "./UpdateUserInfo";
import UpdatePassword from "./UpdatePassword";
import { Navigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import {ERRORS, NOTIFICATIONS} from '../constants.js'

// const ERRORS = {
//   PASSWORD:
//     "Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character '#?!@$%^&*-_'.",
//   CONFIRM_PASSWORD: "Passowrd and confirm password does not match.",
//   GENERIC_FAILED: "Oops! Something went wrong. Please try again.",
//   UPDATE_FAILED: "Updation failed!",
// };
// const NOTIFICATIONS = {
//   UPDATE_SUCCESS: "Profile updated successfully!",
//   PWD_UPDATE_SUCCESS: "Password updated successfully!",
// };
class User extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isUpdatePwd: false,
      fname: "",
      lname: "",
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
    if (FN.length >= 3) this.setState({ ...this.state, fname: FN });
  }
  onLNChange(event) {
    var LN = event.target.value;
    if (LN.length >= 3) this.setState({ ...this.state, lname: LN });
  }
  onFormSubmit(event) {
    event.preventDefault();
    var { fname, lname, isUpdatePwd, currPassword, password, email } = this.state;
    var errorMessages = [], notifications = [];
    this.setState({...this.state, isLoading: true, errorMessages:[], notifications:[]})
    if (!isUpdatePwd) {
        //UPDATE USER INFO
      var data = JSON.stringify({
        fname: fname ,
        lname: lname ,
        email: email 
      });
      axios
        .put("/api/v1/user", data, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer '+ this.context.getToken()
          },
        })
        .then((res) => {
          if (res.status === 200) {
            notifications.push(NOTIFICATIONS.UPDATE_SUCCESS);
            this.setState({
              ...this.state,
              notifications,
              errorMessages: [],
              fname: res.data.fname,
              lname: res.data.lname,
              email: res.data.email,
              isLoading: false
            });
             let { setUser } = this.context;
             setUser(res.data);
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
    else {
        //UPDATE PASSWORD
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
              'Authorization': 'Bearer '+ this.context.getToken()
            },
          })
          .then((res) => {
            if (res.status === 200) {
              notifications.push(NOTIFICATIONS.UPDATE_SUCCESS);
              this.setState({
                ...this.state,
                notifications,
                errorMessages:[],
                isLoading: false,
                isUpdatePwd: false
              });
            } else {
              errorMessages.push(ERRORS.UPDATE_FAILED);
              this.setState({
                ...this.state,
                errorMessages,
                notifications: [],
                isLoading: false
              });
            }
          })
          .catch((err) => {
            //Error
            errorMessages.push(ERRORS.UPDATE_FAILED);
            this.setState({
              ...this.state,
              errorMessages,
              notifications: [],
              isLoading: false
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
  componentDidMount() {
    const user= this.context.getUser();
    let errorMessages = []
    if(user){
    axios
      .get(`/api/v1/user/${user.email}`,{ headers:{
        'Authorization': 'Bearer '+ this.context.getToken()
      }})
      .then((res) => {
        if (res.status === 200) {
            const user = res.data
          this.setState({...this.state, fname: user.fname, lname: user.lname, email: user.email, isLoading: false,  errorMessages:[], notifications:[]})

        } else {
          errorMessages.push(ERRORS.GENERIC_FAILED)
          this.setState({...this.state, errorMessages, isLoading: false, notifications: []})
        }
      })
      .catch((err) => {
        //Error
          errorMessages.push(ERRORS.GENERIC_FAILED)
          this.setState({...this.state, errorMessages, isLoading: false, notifications: []})
      });
    }
  }

  render() {
    var { errorMessages, notifications, isUpdatePwd, fname, lname, email, isLoading } = this.state;
    const user = this.context.getUser()
    return (
    <>
    <Spinner show={isLoading}/>
      {!user 
        ? (<Navigate to="/login" replace={true}/>)
        : <div>
        {errorMessages.length ? this.displayNotification(true) : ""}
        {notifications.length ? this.displayNotification(false) : ""}

        <div className="form">
          <div className="form-header">
            {
              <>
                <label className={"tab-active"}>MY PROFILE</label>
              </>
            }
          </div>
          <div className="form-body">
            {!isUpdatePwd ? (
              <UpdateUserInfo
                fname={fname} lname={lname} email={email}
                onFNChange={this.onFNChange}
                onLNChange={this.onLNChange}
                onFormSubmit={this.onFormSubmit}
                onUpdatePwdClick={this.onUpdatePwdClick}
              />
            ) : (
              <UpdatePassword
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
     }
    </>  
    );
  }
}

export default User;