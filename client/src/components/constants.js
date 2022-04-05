
export const ERRORS = {
    PASSWORD:
      "Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character '#?!@$%^&*-_'.",
    CONFIRM_PASSWORD: "Passowrd and confirm password does not match.",
    GENERIC_FAILED: "Oops! Something went wrong. Please try again.",
    UPDATE_FAILED: "Updation failed!",

    // EMAIL: "Invalid User!",
    PAYMENT_FAILED: "Payment failed!",
    OTP_EXPIRED: "OTP Expired!",
    OTP_REQUIRED: "OTP is required!",

    EMAIL: "Invalid Email ID."
    ,LOGIN_FAILED: "Authentication failed!"
    ,USER_VERIFY_FAILED: "User veriication failed!"
    ,USER_ALREADY_EXISTS: "User already exists!"
    ,USER_REGISTRATION_FAILED: "User registration failed!"
    ,USER_NOT_FOUND: "User not found!"

    ,INVALID_EVNET: "Event name must have a minimum of 3 characters!"
    ,INVALID_DESC: "Event description must have a minimum of 5 characters!"
    ,INVALID_CITY: "City is required!"
    ,INVALID_SLOT: "A slot must have a valid date, start time, end time, and must have atleast 1 GA ticket!"
    ,INVALID_PRICE: "Price is required!"
    ,INVALID_VIP_PRICE: "Price for VIP slots is required!"
    ,INVALID_MAX_TICKETS: "Maximum bookings cannot be 0!"
    ,INVALID_IMAGEURL: "Image URL is required!"
    ,EVENT_ADDITION_FAILED: "Oops! Something went wrong while creating event."

    ,INVALID_DATE: "Date is required!"
    ,INVALID_TIME: "Time is required!"
    ,INVALID_TICKETS: "Book at least 1 ticket to proceed!"
    ,MAX_LIMIT_EXCEEDED: "Maximum booking limit exceeded!"

    ,CANCELERROR: "Order is already cancelled. Please refresh the page"

    ,EVENT_CONFLICTS: "Request conflict with the current state of the target resource."
    ,EVENT_DELETION_FAILED: "Event deletion failed!"
    ,EVENT_EDIT_FAILED: "Event updation failed!"
  };

export const NOTIFICATIONS = {
    UPDATE_SUCCESS: "Profile updated successfully!"
    ,PWD_UPDATE_SUCCESS: "Password updated successfully!"

    ,SIGNUP_SUCCESS: "Successfully Registered!"
    ,OTP_SENT: "OTP sent to the registered email!"
    ,PWD_RESET_SUCCESS: "Password reset successful!"

    ,EVENT_SAVE_SUCCESS:"Event saved successfully!"
    ,EVENT_ALREADY_EXISTS: "Event already exists!"

    ,CANCELLED: "Order cancelled successfully."

    ,EVENT_DELETE_SUCCESS: "Event deleted successfully!"
    ,EVENT_EDIT_SUCCESS: "Event updated successfully!"
  };

export const ORDER_STATUS = {
    CANCELLED: 'Cancelled'
}

export const TICKET_TYPE={VIP:'VIP', GA:'GA'}

export const CITIES=[
    {id: 1, name: 'Hyderabad'},
    {id: 2, name: 'Bangalore'},
    {id: 3, name: 'Delhi'},
    {id: 4, name: 'Mumbai'}
]

export const EMPTY_DATASET ={
    NO_UPCOMING_EVENTS: 'No upcoming events found.'
    ,NO_ORDERS: 'No orders found.'
    ,NO_EVENT_DATA: 'Either you are unauthorized or this event does not exist in our database.'
    ,NO_DATA: 'No records found.'
}

export const MESSAGES= {
    LOGOUT: 'You signed out of your account.'
}