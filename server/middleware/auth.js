const jwt = require('jsonwebtoken');
const jwtsecret = '8531b17998123b1e068999df6c385ed95ec45a88157fdf4a582249c8bd254023c158c9';
const User = require('../models/user')

const auth = async (req, res, next) =>{
    
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        
        const decoded = jwt.verify(token,jwtsecret);
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        if (!user){
            throw new Error()
        }
        req.user = user;
        next()
    } catch(e) {
        return res
            .status(401)
            .json({message: "Not authorized, token not available"})
    }
}

module.exports = auth;