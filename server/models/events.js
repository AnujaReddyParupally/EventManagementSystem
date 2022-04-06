const mongoose = require("mongoose");
const User = require("./user");

const EventSchema = mongoose.Schema(
    {
    eventname: {
        type: String,
        required: true,
        unique: true,
    },
    city:{
        type: Array,
        default : [],
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    tags:{
        type: Array,
        default : [],
        required: true,
    },
    VIPprice:{
        type: Number,
        required: true,
    },
    GAprice:{
        type: Number,
        required: true,
    },
    MaxTickets: {
        type: Number,
        required: true,
    },
    ImageURL: {
        type: String,
        required: true,
    },
    slots:[{
        date: {
            type: String,
            default: '',
            required: true,
        },
        starttime: {
            type: String,
            // default: Date.now,
            required: true,
        },
        endtime: {
            type: String,
            // default: Date.now,
            required: true,
        },
        viptickets: {
            type: Number,
            required: true,
        },
        gatickets: {
            type: Number,
            required: true,
        },
        availVIPTick: {
            type: Number,
            required: false,
        },
        availGATick: {
            type: Number,
            required: false,
        }

    }]
},
{ timestamps: true }
)
 
//STORE ONLY DATE NOT TIME IN SLOT DATE
EventSchema.pre("save", function(next){
    const event=this;
    if(event.isModified('slots.date')){
        console.log('date')
    }
    next();
})

EventSchema.statics.findByEventName = async (eventname) => {
    const event = await Event.find({
        eventname: {$regex: '.*'+eventname+'.*', $options: 'i' }
      });
      console.log(event)
    if (!event){
        return null;
    }
    return event;
  }
  
const Event = mongoose.model('Event', EventSchema)

module.exports = Event