const Order = require("../models/order");
const Event = require("../models/events");
const e = require("express");


//all orders event name city image url event date amd time
const fetchOrders = async (req, res, next) => {
    try {
        Order.find({userID:req.params.id}).populate('userID eventID').exec((err, orders) => {
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

        await Event.findOne({ _id: req.body.eventID }).exec((err, event) => {

            if (err || !event) {
                res.status(500).json({
                    message: `Event with id ${req.body.eventID} is not available.  `
                });
            } else {
                start = event.slots[0].starttime;
                end = event.slots[0].endtime;
                vipt = event.slots[0].viptickets;
                gat = event.slots[0].gatickets;
                availvip = event.slots[0].availVIPTick - req.body.viptickets;
                availga = event.slots[0].availGATick - req.body.gatickets;
            
                if (event.MaxTickets < (req.body.viptickets+req.body.gatickets)){
                    res.status(500).json({
                        message: `Event with id ${req.body.eventID} has a maximum limit of ${event.MaxTickets} per order. `
                    });
                }
                else if (availvip < 0 || availga < 0) {
                    if (event.slots[0].availVIPTick >= 0 || vent.slots[0].availGATick >= 0) {
                        res.status(500).json({
                            message: `Event with id ${req.body.eventID} is not available for the requested seats. Currently we have ${event.slots[0].availGATick} GA and ${event.slots[0].availVIPTick} VIP seats. `
                        });
                    }
                    
                } else {
                    let order = new Order({
                        userID: req.body.userID,
                        eventID: req.body.eventID,
                        vipticks: req.body.viptickets,
                        gaticks: req.body.gatickets,
                        price: req.body.price,
                        orderStatus: req.body.orderStatus,
                    }).save()
                        .then(event => {
                            // Event.findOneAndUpdate({ _id: req.body.eventID }, { $set: { slots: { starttime: start, endtime: end, viptickets: vipt, gatickets: gat, availVIPTick: availvip, availGATick: availga, } }}).exec();
                            Event.findByIdAndUpdate({ _id: req.body.eventID }, {
                                slots: {
                                    starttime: start,
                                    endtime: end,
                                    viptickets: vipt,
                                    gatickets: gat,
                                    availVIPTick: availvip,
                                    availGATick: availga,
                                }
                            }).exec();
                            res.json({ event });
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
                    Event.findById({ _id: idEvent }).exec((err, event) => {
                        start = event.slots[0].starttime,
                            end = event.slots[0].endtime,
                            vipt = event.slots[0].viptickets,
                            gat = event.slots[0].gatickets,
                            availvip = event.slots[0].availVIPTick;
                        availga = event.slots[0].availGATick;
                        Event.findByIdAndUpdate({ _id: idEvent }, {
                            slots: {
                                starttime: start,
                                endtime: end,
                                viptickets: vipt,
                                gatickets: gat,
                                availVIPTick: availvip + addvip,
                                availGATick: availga + addga,
                            }
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