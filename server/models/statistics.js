const _=require('lodash');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = require('../configuration/config');

//Trafic Global : par Annee et pour tous les clients :IMPORT
exports.GlobalImport=((req,res)=>{
var body=_.pick(req.body,['Annee']);
var valeur=[body.Annee];
db.query('SELECT MONTH(Date_entree) AS name, count(idVehicule) AS value FROM vehicule WHERE year(Date_entree)=? GROUP BY MONTH(Date_entree) ',valeur,(error,result)=>{
if(error){
    console.log(error);
    res.status(401).send(error);
}
else {
    res.status(200).send(result);
}
});
});
//Trafic Global : par Annee et pour tous les clients par rapport au mois : EXPORRT
exports.GlobalExport=((req,res)=>{
    var body=_.pick(req.body,['Annee']);
    var valeur=[body.Annee];
    db.query('SELECT MONTH(Date_sortie) AS name, count(idVehicule) AS value FROM vehicule WHERE year(Date_sortie)=? GROUP BY MONTH(Date_sortie) ',valeur,(error,result)=>{
    if(error){
        console.log(error);
        res.status(401).send(error);
    }
    else {
        res.status(200).send(result);
    }
    });
    });
    //Trafic par client Annuel : par année EXPORRT
    exports.ExportClientAnnuel=((req,res)=>{
        var body=_.pick(req.body,['Annee']);
        var valeur=[body.Annee];
        db.query('SELECT Client AS name, count(idVehicule) AS value FROM vehicule WHERE  year(Date_sortie)=? GROUP BY Client ',valeur,(error,result)=>{
        if(error){
            console.log(error);
            res.status(401).send(error);
        }
        else {
            res.status(200).send(result);
        }
        });
        });

         //Trafic par client Annuel : par année IMPORT
    exports.ImportClientAnnuel=((req,res)=>{
        var body=_.pick(req.body,['Annee']);
        var valeur=[body.Annee];
        db.query('SELECT Client AS name, count(idVehicule) AS value FROM vehicule WHERE  year(Date_entree)=? GROUP BY Client ',valeur,(error,result)=>{
        if(error){
            console.log(error);
            res.status(401).send(error);
        }
        else {
            res.status(200).send(result);
        }
        });
        });
//Trafic par client : par mois et par année EXPORRT
exports.ExportClient=((req,res)=>{
    var body=_.pick(req.body,['Month','Annee']);
    var valeur=[body.Month,body.Annee];
    db.query('SELECT Client AS name, count(idVehicule) AS value FROM vehicule WHERE MONTH(Date_sortie)=? AND year(Date_sortie)=? GROUP BY Client ',valeur,(error,result)=>{
    if(error){
        console.log(error);
        res.status(401).send(error);
    }
    else {
        res.status(200).send(result);
    }
    });
    });
    //Trafic par client : par mois et par année IMPORT
    exports.ImportClient=((req,res)=>{
        var body=_.pick(req.body,['Month','Annee']);
        var valeur=[body.Month,body.Annee];
        db.query('SELECT  Client AS name,count(idVehicule) AS value FROM vehicule WHERE MONTH(Date_entree)=?  AND year(Date_sortie)=? GROUP BY Client ',valeur,(error,result)=>{
        if(error){
            console.log(error);
            res.status(401).send(error);
        }
        else {
            res.status(200).send(result);
        }
        });
        });
        //Statistiques :Nombre de Voitures entrant(Import) un mois Avant
        exports.ImportMoisAvant=((req,res)=>{
        db.query('SELECT count(idVehicule) AS value FROM vehicule WHERE MONTH(date_entree)=MONTH(CURRENT_DATE())-1',(error,result)=>{
        if(error){
            console.log(error);
            res.status(401).send(error);
        }
        else {
            res.status(200).send(result);
        }
        });
        });

        
            //Statistiques :Nombre de Voitures sortant(Export) un mois Avant
            exports.ExportMoisAvant=((req,res)=>{
                db.query('SELECT count(idVehicule) AS value FROM vehicule WHERE MONTH(date_sortie)=MONTH(CURRENT_DATE())-1',(error,result)=>{
                if(error){
                    console.log(error);
                    res.status(401).send(error);
                }
                else {
                    res.status(200).send(result);
                }
                });
                });
        


    //délais de séjour par client.
    exports.delaiSejour=((req,res)=>{
    var body=_.pick(req.body,['Month','Annee']);
    var valeur=[body.Month,body.Annee];
    db.query('SELECT DATEDIFF(Date_sortie,Date_entree) AS Délais_de_séjour,Client FROM vehicule WHERE MONTH(Date_entree)=? AND year(Date_entree)=? GROUP BY Client',valeur,(error,result)=>{
        if(error){
            console.log(error);
            res.status(401).send(error);
        }
        else {
            res.status(200).send(result);   
        }
        });
    });

    //Taux de remplissage : Occupé.
        //Taux de remplissage : Réservé.
    
        //Taux de remplissage : Libre.
        exports.Liberation=((req,res)=>{
            var body=_.pick(req.body,['Niveau','Date']);
            var valeur=[body.Niveau,body.Date];
            db.query('SELECT COUNT(cellule.Status) AS Nombre_place_Occupee FROM vehicule LEFT JOIN cellule ON cellule.idCellule=vehicule.idCellule WHERE cellule.Niveau=? AND cellule.Status="O" AND Date_entree<=? AND Date_sortie="0000-00-00"',valeur,(error,result)=>{
                var objO={...result};
                if(error){
                    console.log(error);
                
                }
                else {
                    console.log(result);
                    var val=[body.Niveau];
                    db.query('SELECT COUNT(cellule.Status) AS Nombre_place_Reserve FROM vehicule LEFT JOIN cellule ON cellule.idCellule=vehicule.idCellule WHERE cellule.Niveau=? AND cellule.Status="R"',val,(error,result)=>{
                        var objR ={...result};
                        if(error){
                            console.log(error);
                         
                        }
                        else{
                            console.log(objR['0'].Nombre_place_Reserve);
                            console.log(objO['0'].Nombre_place_Occupee);
                            var reserve= objR['0'].Nombre_place_Reserve;
                            var occupe= objO['0'].Nombre_place_Occupee;
                            console.log(result);
                           db.query('SELECT (1000-(?+?)) AS Nombre_Place_Libre',[reserve,occupe],(error,result)=>{
                            var objL ={...result};
                            if(error){
                                console.log(error);
                             
                            }
                            else{
                                var Libre =objL['0'].Nombre_Place_Libre;
                                console.log(result);
                                res.json({
                                    
                                        '0':{name : 'Occupe',value: occupe},
                                        '1':{name : 'Reserve',value: reserve},
                                        '2':{name : 'Libre',value: Libre},
                                    
                                });

                            }
                           });
                        }
                    }) ;
                }
            });
        });
    
  //statistiques pour les voitures ont des avaries dans un mois par client et par marque.
  exports.Avaries=((req,res)=>{
    var body=_.pick(req.body,['MONTH']);
    var valeur=[body.MONTH];
    db.query('SELECT COUNT(vehicule.idvehicule) AS Nombre_de_voiture, MONTH(vehicule.Date_entree) AS Mois, vehicule.Marque, vehicule.Client, avaries.* FROM avoir LEFT JOIN vehicule ON avoir.idVehicule=vehicule.idVehicule LEFT JOIN avaries ON avoir.idAvarie=avaries.idAvarie WHERE MONTH(vehicule.Date_entree)=? GROUP BY vehicule.idVehicule',valeur,(error,result)=>{
        if(error){
            console.log(error);
          
        }
        else {
            res.status(200).send(result);   
        }
    });
});

//statistiques pour les voitures ont des accessoires manquants dans un mois par client et par marque.
exports.Manquants=((req,res)=>{
    var body=_.pick(req.body,['MONTH']);
    var valeur=[body.MONTH];
    db.query('SELECT COUNT(vehicule.idvehicule) AS Nombre_de_voiture, MONTH(vehicule.Date_entree) AS Mois, vehicule.Marque, vehicule.Client, manquant.* FROM contenir LEFT JOIN vehicule ON contenir.idVehicule=vehicule.idVehicule LEFT JOIN manquant ON contenir.idManquant=manquant.idManquant WHERE MONTH(vehicule.Date_entree)=? GROUP BY vehicule.idVehicule; ',valeur,(error,result)=>{
        if(error){
            console.log(error);
          
        }
        else {
            res.status(200).send(result);   
        }
    });
});

//Statistiques pour les voitures qui ont été affectés dans les SVA en donnant le client et la marque et le mois.
exports.Service=((req,res)=>{
    var body=_.pick(req.body,['MONTH']);
    var valeur=[body.MONTH];
    db.query('SELECT COUNT(vehicule.idVehicule) AS Nombre_de_Voiture, MONTH(service.Date) AS Mois, vehicule.Marque, vehicule.Client, service.TypeService FROM passer LEFT JOIN vehicule ON vehicule.idVehicule = passer.idVehicule LEFT JOIN service ON service.idService = passer.idService WHERE MONTH(service.Date)=? GROUP BY vehicule.idVehicule; ',valeur,(error,result)=>{
        if(error){
            console.log(error);
          
        }
        else {
            res.status(200).send(result);   
        }
    });
});
    //Statistiques :Nombre de Voitures SVA pour chaque jour.
    exports.SvaChaqueJour=((req,res)=>{
        db.query('SELECT COUNT(vehicule.idVehicule) AS value FROM passer LEFT JOIN vehicule ON vehicule.idVehicule = passer.idVehicule LEFT JOIN service ON service.idService = passer.idService WHERE service.Date=CURRENT_DATE()',(error,result)=>{
        if(error){
            console.log(error);
            res.status(401).send(error);
        }
        else {
            res.status(200).send(result);
        }
        });
        });


//Statistiques pour le tableau.
exports.Tableau=((req,res)=>{
 var body=_.pick(req.body,['Niveau','date']);
 var valeur=[body.Niveau,body.date];
 db.query('SELECT Client, Marque, VIN FROM vehicule LEFT JOIN cellule ON cellule.idCellule = vehicule.idCellule WHERE    cellule.Niveau = ? AND cellule.Status = "O" AND Date_entree <=? AND Date_sortie = "0000-00-00"GROUP BY CLIENT',valeur,(error,result)=>{
if(error){
    console.log(error);
}
else{
    res.status(200).send(result);
}
 });
});


//Statistiques des voitures  reservées et occupées en donnant le nombre de voiture par client.
exports.DiagrammeRO=((req,res)=>{
    var body=_.pick(req.body,['Niveau','date']);
    var valeur=[body.Niveau,body.date];
    db.query('SELECT Client, COUNT(vehicule.idVehicule) AS Nombre_place_Occupee, cellule.Status AS O FROM vehicule LEFT JOIN cellule ON cellule.idCellule = vehicule.idCellule WHERE    cellule.Niveau = ? AND cellule.Status = "O" AND Date_entree <=? AND Date_sortie = "0000-00-00"GROUP BY CLIENT',valeur,(error,result)=>{
    var objO =result;
        if(error){
       console.log(error);
   }
   else{
      
       db.query('SELECT Client, COUNT(cellule.Status) AS Nombre_place_Reserve,cellule.Status AS R FROM vehicule LEFT JOIN cellule ON cellule.idCellule=vehicule.idCellule WHERE cellule.Niveau=? AND cellule.Status="R" GROUP BY Client',[body.Niveau],(error,resultat)=>{
        var objR =resultat;
        if(error){
            console.log(error);
        }
        else{
        //     console.log(result);
        //     console.log(objO['0'].Nombre_place_Occupee);
        //     console.log(objO['0'].O);
        //     var occupe=objO['0'].O;
        //     var reserve=objR['0'].R;
        //    var carOccupe=objO['0'].Nombre_place_Occupee;
        //    var carReserve=objR['0'].Nombre_place_Reserve;
        //    var clientO=objO['0'].Client;
        //    var clientR= objR['0'].Client;
        //     res.json({
        //         "name": occupe,
        //         "series" :{
        //           "0":{   "name" : clientO, "value": carOccupe}
        //     }
        //     },
        //     {
        //         // "name": reserve,
        //         // "series" :[
        //             "name" :clientR, "value": carReserve
        //         // ]
        //     }
        //     );

            let occ=objO.map(obj=>{
                return {...obj}
            });
            let i=0;
            let finaleObject={"0": occ[0]};
            for(i=1;i<occ.length;i++){
                let temp={};
                temp[i]=occ[i];
                finaleObject={...finaleObject,...temp}
            }
            let reserve=objR.map(obj=>{
                return {...obj}
            });
 
            let j=0;
            let finaleObjectR={"0": reserve[0]};
            for(j=1;j<reserve.length;j++){
                let temp={};
                temp[j]=reserve[j];
                finaleObjectR={...finaleObjectR,...temp}
            }
            let response={
                "0":{
                "name":"occuppée",
                "series":finaleObject
                },
                "1":{
                    "name":"reservée",
                    "series":finaleObjectR  
                }
            }
            res.json(response);

            
        }
       });
   }
    });
   });
   //Statistiques nombre de voiture occupée pour tous les niveaux.
   exports.TouteVoitures=((req,res)=>{
    db.query('SELECT COUNT(vehicule.idVehicule) AS value FROM vehicule LEFT JOIN cellule ON cellule.idCellule = vehicule.idCellule WHERE cellule.Status = "O" AND Date_sortie = "0000-00-00"',(error,result)=>{
    var objO =result;
        if(error){
       console.log(error);
   }
   else{
       res.status(200).send(result);
   }
    });
});
//Statistiques : nombre de voitures pour toutes les voitures par marque occupée.
exports.VoituresParMarque=((req,res)=>{
    db.query('SELECT Marque AS name,COUNT(vehicule.idVehicule) AS value FROM vehicule LEFT JOIN cellule ON cellule.idCellule = vehicule.idCellule WHERE cellule.Status = "O" AND Date_sortie = "0000-00-00" GROUP BY Marque',(error,result)=>{
    var objO =result;
        if(error){
       console.log(error);
   }
   else{
       res.status(200).send(result);
   }
    });
});