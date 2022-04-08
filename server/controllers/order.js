var mongoose = require('mongoose');
const Order = require("../models/order");
const Event = require("../models/events");
const e = require("express");


//all orders event name city image url event date amd time
const fetchOrders = async (req, res, next) => {
    try {
        Order.find().populate('userID eventID').exec((err, orders) => {
            orders= orders.map(order => {
                const selectedslot = order.eventID[0].slots.find(slot=> slot._id.toString() === order.slotID.toString())
                console.log(selectedslot)
                return {
                    id: order._id,
                    userid: order.userID._id,
                    eventid: order.eventID._id,
                    eventname: order.eventID[0].eventname,
                    city: order.eventID[0].city[0],
                    date: selectedslot.date,
                    endtime: selectedslot.endtime,
                    starttime: selectedslot.starttime,
                    viptickets: order.vipticks,
                    gatickets: order.gaticks,
                    status: order.orderStatus,
                    createddate: order.createdAt,
                    modifieddate: order.updatedAt,
                    totalprice: order.price
                }
               
            })
            console.log(orders)
            res.json({ orders });
        });

    } catch (err) {
        next();
    }
}

//event details 
const fetchOrder = async (req, res, next) => {
    const id = req.params.id;
    try {
        const order = await Order.findOne({ _id: req.params.id });
        console.log(order);

        if (!order) {
            throw {
                message: `unable to fetch order details for ID ${id}`,
            };
        }
        Order.findOne({ _id: req.params.id }).populate('eventID').exec((err, order) => {
            console.log(order)
            res.json({ order });
        })

    } catch (err) {
        res.status(500).json({
            message: `unable to fetch order details for ID ${id} `
        })
    }
}


const createOrder = async (req, res, next) => {
    let availvip = 0, availga = 0, start, end, vipt, gat;
    try {

        await Event.findOne({ _id: req.body.eventID }).exec((err, selectedevent) => {

            if (err || !selectedevent) {
                res.status(500).json({
                    message: `Event with id ${req.body.eventID} is not available.  `
                });
            } else {
                const selectedslot = selectedevent.slots.find(slot =>  slot._id.toString() ===  req.body.id)
                let viptickets = parseInt(req.body.viptickets)
                let gatickets = parseInt(req.body.gatickets)
                date = selectedslot.date
                start = selectedslot.starttime;
                end = selectedslot.endtime;
                vipt = selectedslot.viptickets;
                gat = selectedslot.gatickets;
                availvip = selectedslot.availVIPTick - viptickets;
                availga = selectedslot.availGATick - gatickets;

                console.log('values',req.body.gatickets, selectedslot.availGATick, req.body.viptickets, selectedslot.availVIPTick)
                //console.log(selectedevent.MaxTickets, req.body.viptickets+ req.body.gatickets)
                if (selectedevent.MaxTickets < viptickets+ gatickets){
                    res.status(500).json({
                        message: `Event with id ${req.body.eventID} has a maximum limit of ${selectedevent.MaxTickets} per order. `
                    });
                }
                else if (availvip < 0 || availga < 0) {
                    if (selectedslot.availVIPTick >= 0 || selectedslot.availGATick >= 0) {
                        res.status(500).json({
                            message: `Event with id ${req.body.eventID} is not available for the requested seats. Currently we have ${event.slots[0].availGATick} GA and ${event.slots[0].availVIPTick} VIP seats. `
                        });
                    }
                    
                } else {
                    let order = new Order({
                        userID: req.body.userID,
                        eventID: req.body.eventID,
                        slotID: req.body.id,
                        vipticks: req.body.viptickets,
                        gaticks: req.body.gatickets,
                        price: req.body.price,
                        orderStatus: 'Confirmed',
                    }).save()
                        .then(event => {
                            console.log('before',selectedevent)
                            selectedevent.slots= selectedevent.slots.map(slot=>{
                                if(slot._id === selectedslot._id)
                                {
                                    return {
                                        _id: slot._id,
                                        date: date,
                                        starttime: start,
                                        endtime: end,
                                        viptickets: vipt,
                                        gatickets: gat,
                                        availVIPTick: availvip,
                                        availGATick: availga}
                                }
                                else return slot
                            })
                            console.log('after',selectedevent)
                            // Event.findOneAndUpdate({ _id: req.body.eventID }, { $set: { slots: { starttime: start, endtime: end, viptickets: vipt, gatickets: gat, availVIPTick: availvip, availGATick: availga, } }}).exec();
                            Event.findByIdAndUpdate({ _id: req.body.eventID }, {
                                slots: [
                                    ...selectedevent.slots
                                    ]
                            }).exec();
                            res.status(200).send(true);
                        });
                }
            }
            
        });
    } catch (error) {
        console.log(error);
        next();
    }
}


const cancelOrder = async (req, res, next) => {
    const id = req.params.id;
    let addga = 0, addvip = 0, idEvent, availvip = 0, availga = 0, start, end, vipt, gat;
    try {
        Order.findOne({ _id: req.params.id }).exec((err, order) => {

            if (!order) {
                res.status(500).json({
                    message: `Unable to fetch order details for ID ${id} `
                })
            } else if (order.orderStatus === "Cancelled") {
                res.status(500).json({
                    message: `Order ${id} is already cancelled`
                })
            }
            else {
                Order.findByIdAndUpdate({ _id: req.params.id }, { orderStatus: 'Cancelled' }, function (err, order) {
                    if (err) {
                        console.log(err)
                    }
                })
                Order.findOne({ _id: req.params.id }).exec((err, order) => {

                    addvip = order.vipticks;
                    addga = order.gaticks;
                    idEvent = order.eventID.toString();
                    idSlot = order.slotID.toString()
                    Event.findById({ _id: idEvent }).exec((err, event) => {
                             const selectedslot = event.slots.find(slot=>slot._id.toString()===idSlot) 
                             console.log('cancel - selectedorder',selectedslot)
                            const updated_slots = event.slots.map(slot=>{
                                if(slot._id.toString()===idSlot)
                                return {
                                    _id:slot._id,
                                    date: selectedslot.date,
                                    starttime: selectedslot.starttime,
                                    endtime: selectedslot.endtime,
                                    viptickets: selectedslot.viptickets,
                                    gatickets: selectedslot.gatickets,
                                    availVIPTick: selectedslot.availVIPTick + addvip,
                                    availGATick: selectedslot.availGATick + addga
                                }
                                else
                                return slot
                            }) 
                            console.log('cancel - updated_slots',updated_slots)
                            
                        Event.findByIdAndUpdate({ _id: idEvent }, {
                            slots: [
                                ...updated_slots
                            ]
                        }, function (err, event) {

                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log("Updated Event : ", event);
                            }
                        });
                        console.log(availga + " " + availvip)
                        console.log(addga + " " + addvip);
                     });


                })

                res.json({
                    message: `Order Cancelled Successfully`
                });
            }
        });

    } catch (err) {
        console.log(err);
        next();
    }
}


exports.fetchOrder = fetchOrder;
exports.fetchOrders = fetchOrders;
exports.createOrder = createOrder;
exports.cancelOrder = cancelOrder;