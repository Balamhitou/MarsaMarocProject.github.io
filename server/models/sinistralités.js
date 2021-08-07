const _=require('lodash');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = require('../configuration/config');

//les avaries.
exports.Sinistralités = ((req,res)=>{
    var body = _.pick(req.body,['type','responsable','description','zone','VIN']);
    var vals =[body.type,body.responsable,body.description,body.zone];
    db.query('INSERT INTO avaries (type,responsable,description,zone) VALUES (?,?,?,?)',vals, (error,result)=>{
      var obje={...result};
      if(error){
          console.log(error);
      }
      else{
          res.status(200).send(result);
          db.query('SELECT idVehicule FROM vehicule WHERE VIN=?',[body.VIN], (error, resulat)=>{
            var obbj ={...resulat};
             if(error){
               console.log(error);
             }
             else{
             console.log(resulat);
             console.log(obbj['0'].idVehicule);
             var idvoiture=obbj['0'].idVehicule;
             console.log(obje.insertId);
             var idAvarie= obje.insertId;
             var val = [idAvarie,idvoiture];
             db.query('INSERT INTO avoir (idAvarie, idVehicule) VALUES(?,?)',val, (error, result)=>{
              if(error){
                console.log("the error is : ",error);
              }
              else {
               console.log(result);
              }
             });
             }
          });
      }
    });
});

//les manquants
exports.Manquants =((req,res)=>{
  var body=_.pick(req.body,['Accessoire','VIN']);
  var val= [body.Accessoire];
  db.query('INSERT INTO manquant (Accessoire) VALUES (?)',val,(error,result)=>{
    var obj={...result};
     if(error){
       console.log(error);
     }
     else{
      res.status(200).send(result);
      console.log('id manquant :',obj['0'].insertId);
      var idManq =obj['0'].insertId;
      // db.query('INSERT INTO contenir (idManquant,idVehicule) VALUE(?,?)',[idManq,body.VIN],(error,result)=>{
      //   if(error){
      //     console.log(error);
      //   }
      //   else{
      //     console.log(result);
      //   }
      // });
     }
  });
});