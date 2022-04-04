const { validationResult } = require("express-validator");

const Event = require("../models/events");
const errors = require("../config/eventErrors.json");

const fetchEvents = async (req, res) => {
    const events = await Event.find();
    res.json(events);
  }
  
const fetchEvent = async (req, res, next) => {
    try{
        const event = await Event.findOne({ _id: req.params.id });
        console.log(event)
        if(!event){
            throw{
               data  : `unable to fetch event details for ID ${req.params.id} `,
            };
        }
        res.json(event);
  
    }catch(err){
        next(err);
    }
  }

const fetchEventsOfCity = async (req, res, next) => {
  try {
    const events = await Event.find({ city: req.params.city });
    if (!events) {
      throw {
        data: `unable to fetch events details for City ${req.params.city} `,
      };
    }
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

const searchEvent = async(req,res,next) => {
    try{
      const eventname = req.params.eventname;
      const event = await Event.findByEventName(eventname);
      console.log(event)
      if (!event) {
        throw{
          data: 'unable to find event'
        };
      }
      res.json(event);
    } catch(err){
      next(err);
    }
};

exports.fetchEvent = fetchEvent
exports.searchEvent = searchEvent
exports.fetchEvents = fetchEvents
exports.fetchEventsOfCity = fetchEventsOfCity;
