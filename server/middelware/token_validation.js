const jwt = require('jsonwebtoken');
const {user}=require('./../models/User');

module.exports = ((req,res,next)=>{
   
   try{
    const token = req.body.headers.autorization.split(' ')[1];
    const decodedToken = jwt.verify(token, '123abc');
    req.user =decodedToken;
    next();
   }
   catch(e){
return res.status(401).json({
    'message':"Invalid or expired  token provided !",
    'error':e
});
   }
})