const routes = require('express').Router()
const {getotp, verifyotp} = require('../controllers/OTP')

routes.get('/otp/:email', getotp);
routes.post('/otp',verifyotp)

module.exports = routes