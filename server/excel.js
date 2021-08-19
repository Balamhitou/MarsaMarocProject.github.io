
const xlsx =require('xlsx');
const mysql = require('mysql');
const db = require('./configuration/config');
const workbook = xlsx.readFile('/fichiers/fichier.xlsx');
var worksheet = workbook.Sheets['Feuil1'];

var data =xlsx.utils.sheet_to_json(worksheet);
console.log(data); 
console.log(data[0].VIN);
var valeur=[data[0].VIN,data[0].Nconnaissement,data[0].Marque,data[0].Modele,data[0].Client];
db.query('INSERT INTO vehicule (VIN,Nconnaissement,Marque,Modele,Client) VALUES(?,?,?,?,?)',valeur,(error,result)=>{
if(error){
    console.log(error);
}
else{
    console.log(result);
}
});

// module.exports =posts;