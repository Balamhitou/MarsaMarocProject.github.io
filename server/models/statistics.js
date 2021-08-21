const _=require('lodash');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = require('../configuration/config');

//Trafic Global : par mois et pour tous les clients :IMPORT
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
                                        '2':{name : 'Libre',value: libre},
                                    
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