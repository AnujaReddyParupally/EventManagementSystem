const routes = require('express').Router()
const {getotp, verifyotp} = require('../controllers/OTP')


routes.post('/',verifyotp)
routes.get('/:email', getotp);

module.exports = routes