
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
        
       if(!result || !(await bcrypt.compare(req.body.Password, result[0].Password ))){
         res.status(401).json({message : "Email or password is incorrect"});
       }
       else if(result){
         const id =result[0].id;
         var token = jwt.sign({id},'123abc',{
           expiresIn: "1h"
         });
          return res.json({
            message : "Authentification successful !",
            token : token
            
          });
          
        }
          else{
            res.status(400).json({
              message : "invalid credentials !!!!"
            });
          }
         });
      
    } catch (error){
      console.log(error);
    }
    };
    
