const _=require('lodash');
const xlsx =require('xlsx');
const mysql = require('mysql');

const db = require('./configuration/config');

// const express = require('express');
// const router = express.Router();

exports.readFile=((req,res)=>{
    var body=_.pick(req.body,['numEscale']);
    var val =[body.numEscale];
    console.log(req.file);
        console.log(req.file.path);
        
  
    var workbook = xlsx.readFile(req.file.path);
    var worksheet = workbook.Sheets['Feuil1'];
    
    var data =xlsx.utils.sheet_to_json(worksheet);
    console.log(data); 
    console.log(data['0'].VIN);
    console.log(data[1].VIN);
    i=0;
    for(i;i<data.length;i++){
        var valeur=[data[i].VIN,data[i].Nconnaissement,data[i].Marque,data[i].Modele,data[i].Client];
        db.query('INSERT INTO vehicule (VIN,Nconnaissement,Marque,Modele,Client) VALUES(?,?,?,?,?)',valeur,(error,result)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(result);
                db.query('SELECT idEscale FROM escale WHERE NumEscale=?',val,(error,result)=>{
                var objetEscale={...result};
                if(error){
                    console.log(error);
                }
                else{
                    // let connaissement=[];
                    // for(i=0;i<=Object.keys(obje).length-1;i++){
                    //   let objet={...obje[i.toString()]};
                    //    voitures.push(objet.idVehicule);
                    // }
                    
                  var idescale=objetEscale['0'].idEscale;
                  console.log(idescale);
                  var vals=[idescale,data[0].Nconnaissement];
                  console.log('con : ',data[0].Nconnaissement);
                //   var voit = voitures[j];
                //   j++;
                  db.query('UPDATE vehicule SET idEscale=?  WHERE Nconnaissement=?',vals,(error,result)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                      db.query('UPDATE escale SET status="Actif"  WHERE NumEscale=?',[body.numEscale],(error,result)=>{
                        if(error){
                            console.log(error);
                        }
                        else{
                       console.log(result);
                        }
                    }
                  );
                }
                });
               
               
            }
            });
    }

    
   
});}
res.status(200).send("done");
});


// module.exports =posts;