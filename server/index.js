require("dotenv").config();
require("./config/db");

var express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const logRequests = require("./middleware/log-requests");
const {
    notFoundErrorHandler,
    genericErrorHandler,
  } = require("./middleware/http-error-handlers");
const authRoute = require("./routes/auth");
const otproutes =  require('./routes/OTP')
const eventroutes = require("./routes/event");
const userroutes = require("./routes/user");
const orderRoutes = require('./routes/order');

const app = express()
app.use(logRequests);
app.use(express.json())
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())


app.use('/api/v1/otp',otproutes)
app.use("/api/v1/auth", authRoute);
app.use('/api/v1/events', eventroutes);
app.use('/api/v1/user', userroutes);
app.use('/api/v1/order', orderRoutes);

app.get('/', function (req, res) {
    console.log('route / is accessed.');
    res.send('Hi');
  });

app.use(notFoundErrorHandler);
app.use(genericErrorHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
  
//This code is moved to config/db.js
//const mongoose = require('mongoose')
//const CONNECTION_URL = 'mongodb+srv://feedbacktracker:feedbacktracker123@mern.if1a7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


// mongoose.connect(CONNECTION_URL, {useNewUrlParser:true, useUnifiedTopology:true})
// .then(()=>
//     app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))
// )
// .catch(err=>
//     console.log(err)
// )
