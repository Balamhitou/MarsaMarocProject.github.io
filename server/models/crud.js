const _=require('lodash');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = require('../configuration/config');

//Pointage des vehicules.
exports.CreateVoiture =  ((req,res)=>{
    var body = _.pick(req.body,['VIN']);
    // var now = new Date();
    // var jsonDate = now.toJSON();
    // var currentDate = new Date(jsonDate);
    
    db.query('SELECT VIN,idCellule FROM vehicule WHERE VIN =?', [body.VIN],  (error,result)=>{
    var id={...result};
    if(error){
      console.log(error);
      }

    else{
    res.status(200).send(result);
    console.log(result);
    var chassis = id[0].VIN;
   
    var cell =id[0].idCellule;
    console.log(chassis,cell);
    var etat = 'O';
    db.query('UPDATE cellule SET Status=?  WHERE idCellule=?',[etat,cell],(error, result)=>{
        if(error){
          console.log(error);
        }
        else{
          console.log(result);
          db.query('SELECT Niveau,Ligne,Colonne FROM cellule WHERE idCellule=?',[cell],(error,result)=>{
            if(error){
              console.log(error);
            }
            else{
              console.log(result);
              res.status(200).send(result);
            
            }
          });
        }
      });
    //  db.query('INSERT INTO cellule SET ?',{Niveau : body.Niveau, Ligne : body.Ligne, Colonne : body.Colonne,Status : etat} , (error, result)=>{
    //   var obj = {...result};
    //     if(error){
    //       console.log(error);
    //     }
    //     else{
    //       console.log(obj.insertId);
    //       var idcell = obj.insertId;
    //       res.send(result);
    //       var values = [idcell,body.VIN,currentDate];
    //       console.log(body.VIN);  
    //       db.query('INSERT INTO vehicule (idCellule, VIN,Date_entree) VALUES(?,?,?)',values, (error, result)=>{
    //         if(error){
    //           console.log("the error is : ",error);
    //         }
    //         else {
    //           console.log(result);
              
    //         }
    //       });
    //     }
    //   });
    }
      });
    });
      //Réservation des places 
  exports.Reservation = ((req,res)=>{
    var body = _.pick(req.body,['Niveau','Ligne','Colonne','Nconnaissement','Marque','Date_entree']);
    var places=req.body.places;
    var val=[body.Nconnaissement,body.Marque];
    db.query('SELECT idVehicule FROM vehicule WHERE Nconnaissement=? AND Marque=? ',val, (error,result)=>{
      var obje = {...result};     
      if(error){
        console.log(error);
        }
      else{
        res.status(200).send(result);
        let voitures=[];
        for(i=0;i<=Object.keys(obje).length-1;i++){
          let objet={...obje[i.toString()]};
           voitures.push(objet.idVehicule);
        }
        console.log(voitures);
        var j=0;
        for(i=0; i<=places.length-1;i++){
          var niveau = places[i].Niveau;
          var ligne =places[i].Ligne;
          var colonne = places[i].Colonne;
          var  dateEntree =places[i].Date_entree;
          console.log(dateEntree);
          var etat = 'R';
          var tab=[niveau,ligne,colonne,etat];
          db.query('INSERT INTO cellule (Niveau,Ligne,Colonne,status) VALUES(?,?,?,?)',tab,(error,result)=>{
            var ob={...result};
             if(error){
               console.log(error); 
             }
             else{
               console.log(result);
               var id =ob.insertId;
               console.log(id);
               var voit = voitures[j];
               j++;
               var valeur =[id, dateEntree,voit];
               db.query('UPDATE vehicule SET idCellule=?,Date_entree=? WHERE idVehicule=? ',valeur, (error, result)=>{
                  if(error){
                    console.log(error);
                  }
                  else{
                   res.status(200).send(result);
                  }
               });
             }
          });
        }
    }
        });
  
      });  

   
   //libérer des voitures
    exports.liberationVoiture = ((req,res)=>{
      var body = _.pick(req.body,['Nconnaissement','Marque','Date_sortie']);
      var liberer=req.body.places;
      db.query('SELECT idCellule FROM vehicule WHERE Nconnaissement=? AND Marque=?',[body.Nconnaissement,body.Marque], (error,result)=>{
        var obje = {...result};     
        if(error){
          console.log(error);
          }
        else{
          res.status(200).send(result);
          var cell = obje['0'].idCellule;
          console.log(cell);
          // let cellules=[];
          // for(i=0;i<=Object.keys(obje).length-1;i++){
          //   let objet={...obje[i.toString()]};
          //    cellules.push(objet.idCellule);
          // }
          //console.log(cellules);
        //   var j=0;
        //   for(i=0; i<=liberer.length-1;i++){
        //  console.log(dateSortie);
      var etat = 'L';
        //        var  dateSortie=liberer[i].Date_sortie;
            var tab=[body.Date_sortie,body.Nconnaissement];
            db.query('UPDATE vehicule SET Date_sortie=? WHERE Nconnaissement= ? ',tab,(error,result)=>{
              var ob={...result};
               if(error){
                 console.log(error); 
               }
               else{
                 console.log("sortie changed ",result);
                //  var position = cellules[j];
                //  j++;
                 var valeur =[etat,cell];
                 db.query('UPDATE cellule SET status =? WHERE idCellule= ?',valeur,(error, result)=>{
                    if(error){
                      console.log(error);
                    }
                    else{
                      console.log(result);
                    }
                 });
                 
               }
            });
          }
      
          });
    
        });














     //-------------------------------------------------------------------------------------- 
      //libération d'une voiture.
    exports.libererUneVoiture =((req,res)=>{
      var body = _.pick(req.body,['VIN','Date_sortie']);
      
       db.query('SELECT Date_sortie,idCellule FROM vehicule WHERE VIN=?',[body.VIN], (error, result)=>{
         var obje= {...result};
         if(error){
           console.log("the error is : ",error);
         }
         if((obje['0'].Date_sortie)!='0000-00-00'){
           console.log(obje['0'].Date_sortie);
           return res.status(400).json({message :  "vous ne pouvez pas libérer cette voiture, elle est déja sortie !!"});
         }
         else{
           console.log(result);
           var valeur=[body.Date_sortie,body.VIN];
           db.query('UPDATE vehicule SET Date_sortie=? WHERE VIN= ?',valeur,(error, result)=>{
            console.log('mafhamtch mzn ',result);
             if(error){
               console.log("the error is : ",error);
             }
             else {
                console.log(result);
                var cell =obje[0].idCellule;
                var etat = 'L';
                db.query('UPDATE cellule SET status =? WHERE idCellule= ?',[etat,cell],(error, result)=>{
                 if(error){
                   console.log("the error is : ",error);
                 }
                 else {
                    console.log(result);
                    res.status(200).send(result);
                    
                 }
             
            });
         }
       });
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
          
        console.log(result);
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
                res.status(200).send(result);
               console.log(result);
              }
            });
             }
          });
        }
    });
   });

   //get all 
   exports.getAll =((req,res)=>{
     var val=req.params.VIN;
     console.log(val);
     db.query('SELECT * FROM vehicule WHERE VIN=?',val,(error,result)=>{
        if(error){
          console.log(error);
        }
        else{
          res.status(200).send(result);
        }
     });
   });

   exports.getPlace =((req,res)=>{
     var body= _.pick(req.body,['VIN']);
     var val =[body.VIN];
    console.log(val);
    db.query('SELECT idCellule FROM vehicule WHERE VIN=?',val,(error,result)=>{
      var obj={...result};
       if(error){
         console.log(error);
         
       }
       else{
         
         console.log(result);
         var cell = obj['0'].idCellule;
         console.log(cell);
         var valu=[cell];
         db.query('SELECT Niveau, Ligne, Colonne FROM cellule WHERE idCellule=?',valu,(error,result)=>{
          if(error){
            console.log(error);
          }
          else{
            res.status(200).send(result);
            var etat='O';
            var valeurs=[etat,cell]
            db.query('UPDATE cellule SET status =? WHERE idCellule=?',valeurs,(error,result)=>{
              if(error){
                console.log(error);
              }
              else{
                
                console.log(result);
              }});
          }
         }
          ) }
    });
  });

      // l'essaie 
      exports.dateEssaie=((req,res)=>{
        var body = _.pick(req.body,['Date_sortie','VIN']);
        db.query('SELECT idVehicule FROM vehicule WHERE VIN =?',[body.VIN],(error,result)=>{
          var id ={...result};
       if(error){
         console.log(error);
       }
       else{
         console.log(result);
         var idVoiture =id['0'].idVehicule;
         db.query('UPDATE vehicule SET Date_sortie=? WHERE idVehicule=?',[body.Date_sortie,idVoiture],(error,result)=>{
       if(error){
         console.log(error);
       }else{
       res.status(200).send(result);
       console.log('changed');
         }});
       }
        });
      });