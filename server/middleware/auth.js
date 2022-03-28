const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;
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