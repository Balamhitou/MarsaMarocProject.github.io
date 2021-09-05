
const express= require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { json } = require('body-parser');
const authentificate =require('./middelware/token_validation');
const UserRoute = require('../router/auth');
const Voiture = require('../router/GlobalRouter');
const avaries = require('../router/Sinistralités');
const db = require('./configuration/config');
const Statistiques=require('../router/statistics');
const excelFile=require('./excel');
const cors=require('cors');
const path = require('path');


const port=process.env.PORT || 3000;
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-auth");
  next();
});
app.use(bodyParser.json());
app.use(express.static('public'));

//connection to DB

//Inscription et connexion (créer un utilisateur).
app.use('/auth', UserRoute );
app.use('/crud',Voiture);
app.use('/sinistralites',avaries);
app.use('/statistiques',Statistiques);


app.listen(port, ()=>{
  console.log(`Started up at port ${port}`);
});
















//Inscription
