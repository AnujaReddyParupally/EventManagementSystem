const { validationResult } = require('express-validator');

const Event = require('../models/events');

const errors = require('../config/eventError.json');

exports.fetchEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
}

exports.fetchEvent = async (req, res, next) => {
  try{
      const event = await Event.findOne({ _id: req.params.id });
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
    console.log('createEvent',createEvent);
    createEvent = await createEvent.save();
    res.status(200).json({ createEvent });

  } catch (err) {
    next(err);
    console.log('err------',err);
    console.log('Inside catch block add event');
  }
};

const editevent = async (req, res, next) => {
  let EditEvent = new Event({
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
    const id = req.params.id;
    try {
        await Event.findByIdAndUpdate(id, EditEvent)
        res.json({
            message: 'Event was updated successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: `Cannot update Event with id: ${id}`
        })
    }
    
  } catch (err) {
    next(err);
    console.log('err------',err);
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
    const id = req.params.id;
    try {
        const data = await Event.findByIdAndDelete(id)
        res.json({
            message: `"${data.eventname}" Event was deleted successfully!`
        })
    } catch (error) {
        res.status(500).json({
            message: `Cannot delete event with ID ${id}`
        })
    }
    
  } catch (err) {
    next(err);
    console.log('err------',err);
  }
};


exports.addevent = addevent;
exports.editevent = editevent;
exports.deleteevent = deleteevent;
