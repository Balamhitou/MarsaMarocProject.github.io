
const { default: validator } = require('validator');
const _=require('lodash');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = require('../configuration/config');

exports.signup =  (req,res)=>{
    var body = _.pick(req.body,['Nom','Prenom','Email','Password','Fonction','ImageUrl']);
    db.query('SELECT Email FROM utilisateur WHERE Email =?', [req.body.Email], async (error,result)=>{
      if(!error){
        console.log(error);
      }
      if(result.length > 0){
        return res.status(400).json({message :  "this email is alredy used !!"});
      }
      let hashPassword = await bcrypt.hash(req.body.Password, 10);
      db.query('INSERT INTO utilisateur SET ?',{Nom :body.Nom,Prenom : body.Prenom, Email :body.Email, Password :hashPassword, Fonction : body.Fonction , ImageUrl: body.ImageUrl}, (error, result)=>{
        if(error){
          console.log(error);
        }
        else{
          console.log(result);
          res.send(result);
        }
      });
     });
};


exports.login = async (req,res)=>{
    try{ 
      var body = _.pick(req.body,['Email','Password']);
      if( !req.body.Email || !req.body.Password){
        return res.status(400).json({
          message : "please enter email and password"
      })};
      db.query('SELECT * FROM utilisateur WHERE Email =?',[req.body.Email], async (error, result)=>{
        if(result[0]){
          let resObj={...result[0]};
          console.log(resObj);
          if(!resObj || !(await bcrypt.compare(req.body.Password, resObj.Password ))){
            res.status(401).json({message : "Email or password is incorrect"});
          }
          else if(resObj){
            const id =resObj.idUser;
            console.log(id);
            const email=resObj.Email;
            var token = jwt.sign({id,access:"auth"},'123abc',{
              expiresIn: "1h"
            });
            let auth='auth'
            db.query("INSERT INTO tokens(token,access,idUser) VALUES (?,?,?)",[token,auth,id],(err,resu)=>{
              if(err){
               res.status(400).send(err)
              }
              else if(!res){
                res.status(400).sned('Enable to add to databse');
              }
              else{
               res.header("x-auth",token).status(200).json({
                 email,
                 token 
               });
              }
          
            })
          
             
           }
             else{
               res.status(400).json({
                 message : "invalid credentials !!!!"
               });
             }
        }
        else{
          res.status(404).send('Email not found !');
        }
   

         });
      
    } catch (error){
      console.log(error);
    }
  }
  exports.logout=((req,res)=>{

    console.log(req.user.token)
    db.query("DELETE FROM tokens WHERE token=? AND idUser=?",[req.user.token,req.user.id],(err,result)=>{
      if(err){
        res.status(400).send();
      }
      else{
        res.status(200).json({message : "disconnected !"});
      }
    });
  })
    
    
