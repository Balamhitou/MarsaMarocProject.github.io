const jwt = require('jsonwebtoken');
const user=require('./../models/User');
const db=require("../configuration/config")
module.exports = ((req,res,next)=>{
   // try{
   //    const decoded =jwt.verify(req.body.token,'123abc');
   //    req.user=decoded;
   //    next();
   // }
   const token = req.header('x-auth');
   let decodedToken;
   try{
     decodedToken= jwt.verify(token, '123abc');
    res.user =decodedToken;
   }
   catch(e){
return res.status(401).json({
    'message':e,  
});
   }
console.log(token);
console.log(decodedToken);
 
   db.query("SELECT * FROM utilisateur,tokens WHERE utilisateur.idUser=tokens.idUser AND tokens.access=? AND tokens.token=? and tokens.idUser=?",[decodedToken.access,token,decodedToken.id],(err,resul)=>{
      if(err){
         res.status(401).send("error in sql selection");
      }
      else if(!resul[0]){
         console.log(resul[0]);
         res.status(400).send();
      }
      else{
         let user={...resul[0]}
         req.user={id:user.idUser,token:user.token};
         next();
      }
   })
})
