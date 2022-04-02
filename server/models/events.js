const mongoose = require("mongoose");

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
            default: new Date(),
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
 

EventSchema.statics.findByEventName = async (eventname) => {
    const event = await Event.findOne({
        eventname: eventname
      });
    if (!event){
        return null;
    }
    return event;
  }

const Event = mongoose.model('Event', EventSchema)

module.exports = Event