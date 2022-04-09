const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
        userID : [{ 
            type : mongoose.Types.ObjectId, 
            required:true, 
            ref: 'User'
        }],
        eventID : [{ 
            type : mongoose.Types.ObjectId,
            required: true, 
            ref: 'Event'
        }],
        vipticks : {
            type: Number,
            required: false,
        },
        gaticks: {
            type: Number,
            required: false,
        },
        price : {
            type : Number,
            required :true,
        },
        orderStatus :{
            type : String,
            required : true,
        }

}, {timestamps : true});


OrderSchema.methods.toJSON = function () {
    const order = this.toObject();
    delete order.__v;
    return order;
};

const Order = mongoose.model('Order',OrderSchema);

module.exports = Order;