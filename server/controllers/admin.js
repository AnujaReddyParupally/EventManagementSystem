const { validationResult } = require("express-validator");

const Event = require("../models/events");
const errors = require("../config/eventError.json");


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

const editevent = async (req, res, next) => {
  let EditEvent = new Event({
      eventID: req.body.eventID,
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

  try {
    const err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
      throw {
        ...errors[400],
        data: err.array(),
      };
    }
    const id = req.body.eventID;
      try {
          await Event.findByIdAndUpdate(id, EditEvent)
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
    const id = req.body.eventID;
    try {
        const data = await Event.findByIdAndDelete(id)
        res.json({
            message: `${data.eventID} - Event was deleted successfully!`
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


exports.addevent = addevent;
exports.editevent = editevent;
exports.deleteevent = deleteevent;
