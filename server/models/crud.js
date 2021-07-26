
const _=require('lodash');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = require('../configuration/config');


exports.CreateVoiture =  ((req,res)=>{
    var body = _.pick(req.body,['VIN','Niveau','Ligne','Colonne']);
    var now = new Date();
    var jsonDate = now.toJSON();
    var currentDate = new Date(jsonDate);
    
    db.query('SELECT VIN FROM Vehicule WHERE VIN =?', [body.VIN],  (error,result)=>{
    if(!error){
      console.log(error);
      }
    if(result.length > 0){
        return res.status(400).json({message :  "this car is alredy existed !!"});
    }
    else{

     db.query('INSERT INTO cellule SET ?',{Niveau : body.Niveau, Ligne : body.Ligne, Colonne : body.Colonne} , (error, result)=>{
      var obj = {...result};
        if(error){
          console.log(error);
        }
        else{
          console.log(obj.insertId);
          var idcell = obj.insertId;
          res.send(result);
          var values = [idcell,body.VIN,currentDate];
          console.log(body.VIN);  
          db.query('INSERT INTO vehicule (idCellule, VIN,Date_entree) VALUES(?,?,?)',values, (error, result)=>{
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

    //libération d'une voiture.
    exports.liberationVoiture = ((req,res)=>{
      var body = _.pick(req.body,['VIN']);
      var now = new Date();
      var jsonDate = now.toJSON();
      var  dateActuel= new Date(jsonDate);
      console.log(dateActuel);
      var valeur =[dateActuel,body.VIN];
       db.query('UPDATE vehicule SET Date_sortie =? WHERE VIN= ?',valeur,(error, result)=>{
        if(error){
          console.log("the error is : ",error);
        }
        else {
           console.log(result);
        }
       });
     });
     
   // Modifier Voiture
   exports.Service =((req,res)=>{
    var body = _.pick(req.body,['TypeService','VIN']);
    var valeurs = [body.TypeService];
    db.query('INSERT INTO service (TypeService) VALUES (?)',valeurs,(error,result)=>{
      var obje= {...result};
        if(error){
         console.log("the error is: ", error);
        }
        else{
          res.status(200).send(result);
         // console.log(result);
          db.query('SELECT idVehicule FROM vehicule WHERE VIN=?',[body.VIN], (error, resulat)=>{
            var obbj ={...resulat};
             if(error){
               console.log(error);
             }
             else{
             //console.log(resulat);
             console.log(obbj['0'].idVehicule);
             var idvoiture=obbj['0'].idVehicule;
             //console.log(obje.insertId);
             var idService = obje.insertId;
             var val = [idService,idvoiture];
            db.query('INSERT INTO passer (idService, idVehicule) VALUES(?,?)',val, (error, result)=>{
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