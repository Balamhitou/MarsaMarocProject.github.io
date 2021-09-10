const _=require('lodash');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = require('../configuration/config');


// exports.CreateVoiture =  ((req,res)=>{
//     var body = _.pick(req.body,['VIN']);
//     // var now = new Date();
//     // var jsonDate = now.toJSON();
//     // var currentDate = new Date(jsonDate);
    
//     db.query('SELECT VIN,idCellule FROM vehicule WHERE VIN =?', [body.VIN],  (error,result)=>{
//     var id={...result};
//     if(error){
//       console.log(error);
//       }

//     else{
//     res.status(200).send(result);
//     console.log(result);
//     var chassis = id[0].VIN;
   
//     var cell =id[0].idCellule;
//     console.log(chassis,cell);
//     var etat = 'O';
//     db.query('UPDATE cellule SET Status=?  WHERE idCellule=?',[etat,cell],(error, result)=>{
//         if(error){
//           console.log(error);
//         }
//         else{
//           console.log(result);
//           db.query('SELECT Niveau,Ligne,Colonne FROM cellule WHERE idCellule=?',[cell],(error,result)=>{
//             if(error){
//               console.log(error);
//             }
//             else{
//               console.log(result);
//               res.status(200).send(result);
            
//             }
//           });
//         }
//       });
//     //  db.query('INSERT INTO cellule SET ?',{Niveau : body.Niveau, Ligne : body.Ligne, Colonne : body.Colonne,Status : etat} , (error, result)=>{
//     //   var obj = {...result};
//     //     if(error){
//     //       console.log(error);
//     //     }
//     //     else{
//     //       console.log(obj.insertId);
//     //       var idcell = obj.insertId;
//     //       res.send(result);
//     //       var values = [idcell,body.VIN,currentDate];
//     //       console.log(body.VIN);  
//     //       db.query('INSERT INTO vehicule (idCellule, VIN,Date_entree) VALUES(?,?,?)',values, (error, result)=>{
//     //         if(error){
//     //           console.log("the error is : ",error);
//     //         }
//     //         else {
//     //           console.log(result);
              
//     //         }
//     //       });
//     //     }
//     //   });
//     }
//       });
//     });
      //Réservation des places 
  exports.Reservation = ((req,res)=>{
    var resultatF;
    var body = _.pick(req.body,['Niveau','Ligne','Colonne','Nconnaissement','Marque','Date_entree']);
    var places=req.body.places;
    db.query('SELECT cellule.Status FROM vehicule LEFT JOIN cellule ON cellule.idCellule=vehicule.idCellule WHERE Nconnaissement=? AND Niveau=?',[body.Nconnaissement,body.Niveau],(error,result)=>{
      if(error){
        console.log(error);
       }
      var objh={...result};
      let statusTab=[]
      let i=0;
      for(i=0;i<Object.keys(objh);i++){
        statusTab.push(objh[i]);
      }
      if(statusTab.length!=0){
        
        for(i=0;i<statusTab.length;i++){
          if(stat=="R" || stat=="O"){
            res.status(500).json({
              message :"ces places sont déjà résérvées !"
            });
          }
        }
      }
      // db.query('SELECT COUNT(idVehicule) AS nbrVehicule WHERE Nconnaissement=?',[body.Nconnaissement],(error,response)=>{
      //      if(error){

      //      }
      //      if()
      //      else{

      //      }
      // });
      else{
       
        var val=[body.Nconnaissement,body.Marque];
        db.query('SELECT idVehicule FROM vehicule WHERE Nconnaissement=? AND Marque=? ',val, (error,result)=>{
          console.log("result :"+result);
          var obje = {...result};     
          if(error){
    
            }
          else{
            console.log(obje);
            let voitures=[];
            console.log(obje)
            for(i=0;i<Object.keys(obje).length;i++){
              let objet={...obje[i.toString()]};
               voitures.push(objet.idVehicule);
            }
            
            var j=0;
            for(i=0; i<places.length;i++){
              var niveau = places[i].Niveau;
              var ligne =places[i].Ligne;
              var colonne = places[i].Colonne;
              var etat = 'R';
              var tab=[niveau,ligne,colonne,etat];
              db.query('INSERT INTO cellule (Niveau,Ligne,Colonne,status) VALUES(?,?,?,?)',tab,(error,result)=>{
                var ob={...result};
                 if(error){
                   console.log(error); 
                 }
                 else{
     
                   var id =ob.insertId;
                   console.log(voitures);
                   var voit = voitures[j];
                   j++;
                   console.log("voiture :::::  "+voit)
                   var valeur =[id, body.Date_entree,voit];
                   db.query('UPDATE vehicule SET idCellule=?,Date_entree=? WHERE idVehicule=? ',valeur,(error,resul)=>{
                    if(error){
                      console.log("Update : "+error);
                      res.status(400).send('Error while updating');
                      return error;
           
                    }
                    else{
                      console.log("Successfully Updated")
                    }
                   })
                 
                  
                 }
              })
            }
           res.status(200).send("Inserted Successfully")
        }
            });
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
                      res.status(200).send(result);
                    }
                 });
                 
               }
            });
          }
      
          });
    
        });
//Verification de pointage de sortie par date.
exports.PointageSortie=((req,res)=>{
var body= _.pick(req.body,['VIN','Date']);
var valeurs = [body.VIN];
db.query('SELECT DATE_FORMAT(Date_sortie, " %Y-%m-%d") as date FROM vehicule WHERE VIN=?',valeurs,(error,result)=>{
  var obj={...result};
if(error){
  console.log(error);
}
// date_sortie
// FROM vehicule WHERE VIN=?
// else if(!result | body.Date==result['0'].date_sortie){
//   res.status(401).json({message : "cette voiture n'est pas programmé de sortie pour cette date!"});
// }
else{
  console.log(obj);
  var dateSortie=obj['0'].date;
  let finzleDate=dateSortie.replace(/ /g,"");
  // var dateSortie=result['0'].date_sortie;
//   const formatYmd = dateSortie.toISOString().slice(0, 10);
// console.log(formatYmd);

console.log(body.Date);
console.log(finzleDate);
  if(finzleDate==body.Date){
    db.query('SELECT idCellule FROM vehicule WHERE VIN =?',[body.VIN],(error,result)=>{
  var id={...result};
  if(error){
    return res.status(404).send(error);
  }
  else{
    var idCell=id['0'].idCellule;
    var etat = 'L';
    db.query('UPDATE cellule SET Status =? WHERE idCellule= ?',[etat,idCell],(error, result)=>{
     if(error){
      res.status(401).send(error);
     }
     else {
        console.log(result);
        res.status(200).send(result);
        
     }
 
});
  }
    });
   
  }
  else{
   
    res.status(400).json({message : "cette voiture n'est pas programmé de sortie pour cette date!"});
  
  }

 
}
});
});
//get all of the places.
exports.AllPlaces=((req,res)=>{
 var val=req.params.Niveau;
 db.query('SELECT Niveau,Ligne,Colonne,Status FROM cellule WHERE Niveau=?',val,(error,result)=>{
  if(error){
    res.status(401).send(error);
  }
  else{
    res.status(200).send(result);
  }
 });
});

   // Service à valeur ajouté.
   exports.Service =((req,res)=>{
    var body = _.pick(req.body,['TypeService','Nconnaissement','Date_Service']);
    var valeurs = [body.TypeService,body.Date_Service];
    db.query('INSERT INTO service (TypeService,Date) VALUES (?,?)',valeurs,(error,result)=>{
      console.log(body.date);
      var obje= {...result};
        if(error){
         console.log("the error is: ", error);
        }
        else{
          
        console.log(result);
   
          db.query('SELECT idVehicule FROM vehicule WHERE Nconnaissement=?',[body.Nconnaissement], (error, resulat)=>{
            var obbj ={...resulat};
             if(error){
              res.status(401).send(error);
             }
             else{
             //console.log(resulat);
             
            //  console.log(obbj['0'].idVehicule);
            //  var idvoiture=obbj['0'].idVehicule;
             let voitures=[];
             var j=0;
        for(i=0;i<=Object.keys(obbj).length-1;i++){
          let objet={...obbj[i.toString()]};
           voitures.push(objet.idVehicule);console.log("voiture",voitures);
           var idService = obje.insertId;
           var voit = voitures[j];
           j++;
           var val = [idService,voit];
          db.query('INSERT INTO passer (idService, idVehicule) VALUES(?,?)',val, (error, result)=>{
            if(error){
             console.log(error);
            }
            else {
              console.log(result);
            }
          });
        }
        res.status(200).send(result);
             
           
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

   //afficher la position
   //Pointage des vehicules.
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
 
      // l'essaie : liberer une voiture
      exports.dateEssaie=((req,res)=>{
        var body = _.pick(req.body,['Date_sortie','VIN']);
        db.query('SELECT idVehicule,idCellule FROM vehicule WHERE VIN =?',[body.VIN],(error,result)=>{
          var id ={...result};
       if(error){
         console.log(error);
       }
       else{
         console.log(result);
         var idVoiture =id[0].idVehicule;
         var idCell =id[0].idCellule;
         console.log(idVoiture);
         console.log(idCell);
         db.query('UPDATE vehicule SET Date_sortie=? WHERE idVehicule=?',[body.Date_sortie,idVoiture],(error,result)=>{
       if(error){
         console.log(error);
       }else{
                    res.status(200).send(result);
                    
                 }
             
            });
         }});
       
       
      });
      //Crétion d'escale.
      exports.CreationEscale=((req,res)=>{
       var body=_.pick(req.body,['NumEscale','navire','PostAccotage','DateArrivee']);
       var valeur=[body.NumEscale,body.navire,body.PostAccotage,body.DateArrivee];
       db.query('INSERT INTO escale (NumEscale,navire, PostAccostaeQuai,Date_Arrivee,status) VALUES (?,?,?,?,"inactif")',valeur,(error,result)=>{
          if(error){
            res.status(401).send(error);
          }
          else{
            res.status(200).send(result);
          }
       });
      });
      //recuperer un tableau d'escale.
      exports.TabEscale=((req,res)=>{
         db.query('SELECT NumEscale,navire,PostAccostaeQuai,Date_Arrivee,status FROM escale WHERE  MONTH(Date_Arrivee)=MONTH(CURRENT_DATE()) GROUP BY NumEscale',((error,result)=>{
        if(error){
          res.status(401).send(error);
        }
        else{
          res.status(200).send(result);
          console.log("hh")
        }
        })
         )
        });
        //Affect idEscale to vehicule.
        exports.AffectIdEscale=((req,res)=>{
          var body=_.pick(req.body,['NumEscale']);
          var val=[body.NumEscale];
          db.query('SELECT idEscale FROM escale WHERE NumEscale=?',val,(error,result)=>{
          var ob={...result};
          if(error){
            console.log(error);
          }
          else{
            var idEscale=ob['0'].idEscale;
            db.query('INSERT INTO vehicule SET idEscale=?',idEscale,(error,resulat)=>{
              if(error){
                res.status(401).send(e);
              }
              else{
                res.status(200).send(resulat); 
              }
            });
          }
          });
        });
        exports.GetUser=((req,res)=>{
          var id=req.user.id;
          console.log(id);
           db.query('SELECT * FROM utilisateur WHERE idUser = ?',[id],(error,result)=>{
             if(error){
               res.status(400).send(error);
               console.log(error);
             }else{
              res.status(200).json({message:result});
             }
           });
        });

        exports.UpdateName=((req,res)=>{
          var id=req.user.id;
          var body=_.pick(req.body,['Nom']);
          var vals=[body.Nom,id];
          db.query('UPDATE utilisateur SET Nom=? WHERE idUser=?',vals,(error,result)=>{
           if(error){
   res.status(400).send(error);
          }else{
  res.status(200).send(result);
           }
          });
        });
  
        exports.UpdatePrenom=((req,res)=>{
          var id=req.user.id;
          var body=_.pick(req.body,['Prenom']);
          var vals=[body.Prenom,id];
          db.query('UPDATE utilisateur SET Prenom=? WHERE idUser=?',vals,(error,result)=>{
           if(error){
   res.status(400).send(error);
          }else{
  res.status(200).send(result);
           }
          });
        });
  
        exports.UpdateEmail=((req,res)=>{
          var id=req.user.id;
          var body=_.pick(req.body,['Email']);
          var vals=[body.Email,id];
          db.query('UPDATE utilisateur SET Email=? WHERE idUser=?',vals,(error,result)=>{
           if(error){
   res.status(400).send(error);
          }else{
  res.status(200).send(result);
           }
          });
        });
  
        exports.UpdatePsw=((req,res)=>{
          var id=req.user.id;
          var body=_.pick(req.body,['passwordActuel','newPassword']);
          console.log(body.passwordActuel);
          console.log(body.newPassword);
          db.query('SELECT Password from utilisateur WHERE idUser=?',[id],(err,resul)=>{
            let obj={...resul[0]}
            
            bcrypt.compare(body.passwordActuel,obj.Password)
            .then(resultat=>{
              console.log(resultat);
              if(resultat){
                     
              bcrypt.hash(body.newPassword, 10).then(val=>{
                console.log(val);
              
                db.query('UPDATE utilisateur SET Password=? WHERE idUser=?',[val,id],(error,result)=>{
                  if(error){
                res.status(400).json({error});
                 }else{
                res.status(200).json({message:"Updated Successfully !"});
                  }
              })
              })
            }
            else{
              res.status(401).send({error:'Le mot de passe actuel est incorrect ! '})
            }
            })
  
            .catch(erreur=>{
              res.status(500).send(erreur);
            })
          })
        
           
             });
          

exports.UpdateFonction=((req,res)=>{
  var id=req.user.id;
  var fonction=req.body.fonction;
  db.query('UPDATE utilisateur SET fonction=? WHERE idUser=?',[fonction,id],(error,resultat)=>{
    if(error){
      res.status(400).json({error})
    }
    else{
      res.status(200).json({message:"Updated succesfully !"})
    }
  });

})
      