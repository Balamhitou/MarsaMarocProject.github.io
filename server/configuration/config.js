
const express= require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { json } = require('body-parser');



var db= mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'marsamaroc'
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