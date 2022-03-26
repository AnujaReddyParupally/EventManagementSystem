const Order = require("../models/order");

//all orders event name city image url event date amd time
const fetchOrders = async (req, res, next) => {
    try{
        Order.find().populate('userID eventID','title description city imageURL Date startTime').exec((err, orders) => {
            res.json({ orders });
        });
        
    }catch(err){
        next();
    }
}

//event details 
const fetchOrder = async (req, res, next) => {
    try{
        const order = await Order.findOne({_id: req.params.id});
        if(!order){
            throw{
               data  : `unable to fetch oder details for ID ${req.params.id} `,
            };
        }
        Order.findOne({_id: req.params.id}).populate('eventID').exec((err, order2) => {
            res.json({order2});
        })
    }catch(err){
        next();
    }
}
const createOrder = async (req, res, next) => {
    try{
        let order = new Order({
            userID : req.body.userID,
            eventID : req.body.eventID,
            viptickets : req.body.viptickets,
            gatickets : req.body.gatickets,
            price : req.body.price,
            orderStatus : req.body.orderStatus,
        });
        order = await order.save();
        res.json({ order });
    }catch(err){
        next();
    }
}

exports.fetchOrder = fetchOrder;
exports.fetchOrders = fetchOrders;
exports.createOrder = createOrder;