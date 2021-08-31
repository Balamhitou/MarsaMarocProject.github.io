
const express= require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { json } = require('body-parser');

//vehicule_ibfk_2

var db= mysql.createConnection({
    host : 'sql11.freemysqlhosting.net',
    user : 'sql11433562',
    password : 'kYlkltzVdd',  
    database : 'sql11433562'
  });
  db.connect((error)=>{
   if(error){
     console.log(error)
   }
   else{
     console.log('connected')
   }
  
  });

  module.exports =db;
  // host : 'sql11.freemysqlhosting.net',
  // user : 'sql11433562',
  // password : 'kYlkltzVdd',
  // database : 'sql11433562'