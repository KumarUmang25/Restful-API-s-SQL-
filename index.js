const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));



const connection = mysql.createConnection({  //to create a connection between the server and database
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password:'Doingitforyou_25'
});

let  getRandomUser=()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(), 
    faker.internet.email(),
    faker.internet.password(),
  ];
}

app.listen("8080",()=>{
  console.log("App is listening on port 8080");
});

//HOME ROUTE
app.get("/",(req,res)=>{
  let q="SELECT count(*) FROM user";
  console.log("Welcome to Home Page");
  try{
  connection.query(q,(err,result)=>{
    if(err) throw err;
    let count=result[0]["count(*)"];
    res.render("home.ejs",{count});
  }); 
}catch(err){
   console.log(err);
   res.send("Some error in DB");
}
});

//SHOW ROUTE
app.get("/user",(req,res)=>{
  let q="SELECT * FROM user";
  console.log("Welcome to Home Page");
  try{
  connection.query(q,(err,result)=>{
    if(err) throw err;
    let data=result;
    res.render("users.ejs",{data});
  }); 
}catch(err){
   console.log(err);
   res.send("Some error in DB");
}
});

//EDIT ROUTE
app.get("/users/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;  //added extra quotes to pass it as string so we can compare else we can't
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let data=result[0];
      console.log(data);
      res.render("edit.ejs",{data});
    }); 
  }catch(err){
     console.log(err);
     res.send("Some error in DB");
  }
});

//UPDATE ROUTE
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formPassword,username:newUsername}=req.body;
  let q=`SELECT * FROM user WHERE id='${id}'`;  //added extra quotes to pass it as string so we can compare else we can't
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let data=result[0];
      if(data.password==formPassword){
        let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        try{
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
          }); 
        }catch(err){
           console.log(err);
           res.send("Some error in DB");
        }
      }else{
        res.send("Wrong Password");
      }
    }); 
  }catch(err){
     console.log(err);
     res.send("Some error in DB");
  }
});




