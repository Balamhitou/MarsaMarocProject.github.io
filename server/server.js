
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
const cors=require('cors');
// const fastcsv = require("fast-csv");
// const fs = require("fs");


const port=process.env.PORT || 3000;
var app = express();
app.use(cors());
app.use(bodyParser.json());

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
