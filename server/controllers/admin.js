const { validationResult } = require("express-validator");

const Event = require("../models/events");
const errors = require("../config/eventErrors.json");


const addevent = async (req, res, next) => {
  try {
    const err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
      throw {
        ...errors[400],
        data: err.array(),
      };
    }
    const checkeventname = await Event.findOne({
      eventname: req.body.eventname,
    });
    if (checkeventname) {
      res.status(409).json({
        ...errors[409],
        data: `Event with event name : ${req.body.eventname} already exists`,
      });
      console.log("inside if checkeventname")
    } else {
      let createEvent = new Event({
        eventname: req.body.eventname, 
        city: req.body.city, 
        description: req.body.description, 
        tags: req.body.tags, 
        VIPprice: req.body.VIPprice, 
        GAprice: req.body.GAprice, 
        MaxTickets: req.body.MaxTickets,
        ImageURL: req.body.ImageURL,
        slots: req.body.slots,
      });
      console.log("createEvent",createEvent);
      createEvent = await createEvent.save();
      res.status(200).json({ createEvent });
    }
  } catch (err) {
    next(err);
    console.log("err------",err);
    console.log("Inside catch block add event");
  }
};

const updateevent = async (req, res, next) => {
  let UpEvent = new Event({
      eventname: req.body.eventname, 
      city: req.body.city, 
      description: req.body.description, 
      tags: req.body.tags, 
      VIPprice: req.body.VIPprice, 
      GAprice: req.body.GAprice, 
      MaxTickets: req.body.MaxTickets,
      ImageURL: req.body.ImageURL,
      slots: req.body.json_data,
    });

  try {
    const err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
      throw {
        ...errors[400],
        data: err.array(),
      };
    }
    const {id} = req.body.eventname.value;
      try {
          await Event.findByIdAndUpdate(id, UpEvent)
          res.json({
              message: "Event was updated successfully"
          })
      } catch (error) {
          res.status(500).json({
              message: `Cannot update Event with id: ${id}`
          })
      }
    
  } catch (err) {
    next(err);
    console.log("err------",err);
  }
};

const deleteevent = async (req, res, next) => {
  try {
    const err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
      throw {
        ...errors[400],
        data: err.array(),
      };
    }
    const {id} = req.body.eventname.value;
    try {
        const data = await Event.findByIdAndDelete(id)
        res.json({
            message: `${data.eventname} - Event was deleted successfully!`
        })
    } catch (error) {
        res.status(500).json({
            message: `Cannot delete event with id ${id}`
        })
    }
  } catch (err) {
    next(err);
    console.log("err------",err);
  }
};

const fetchEventsOfCity = async (req, res, next) => {
  try {
    const events = await Event.find({ city: req.params.city });
    if (!events) {
      throw {
        data: `unable to fetch events details for City ${req.params.city} `,
      };
    }
    res.json(events);
  } catch (err) {
    next(err);
  }
};

const searchevent = async(req,res,next) => {
  try{
    const eventname = req.params.eventname;
    const event = await Event.findByEventName(eventname);
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

exports.addevent = addevent;
exports.updateevent = updateevent;
exports.deleteevent = deleteevent;
exports.searchevent = searchevent;
exports.fetchEventsOfCity = fetchEventsOfCity;