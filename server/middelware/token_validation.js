const jwt = require('jsonwebtoken');
const user=require('./../models/User');

module.exports = ((req,res,next)=>{
   // try{
   //    const decoded =jwt.verify(req.body.token,'123abc');
   //    req.user=decoded;
   //    next();
   // }
   try{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, '123abc');
    res.user =decodedToken;
    next();
   }
   catch(e){
return res.status(401).json({
    'message':e,  
});
   }
})
