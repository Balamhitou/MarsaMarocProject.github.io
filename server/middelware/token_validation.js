const jwt = require('jsonwebtoken');

module.exports = ((req,res,next)=>{
   var token = req.body.token;
    if(token){
       token = jwt.verify(token,'123abc',(err,decoded)=>{
       if(err){
    res.json({
        message :"Invalid Token !"
    });
     }
      else{
       next();
      }
       });
    }
    else{
    res.json({
        message :" unthorized user!"
    });

   }
  });