const express = require("express");
const app = express();
const fs = require("fs");

//set view engine - to render web pages using templates
app.set("view engine", "ejs");

//set public folder
app.use(express.static("public"));

//use middleware to handle incomming payloads
app.use(express.urlencoded());



//set user router
const userRouter = require("./routes/user");
app.use("/user",userRouter);

//set customer router
const customerRouter = require("./routes/customer");
// app.use("/customer",customerRouter);

//set medicine router
const medicineRouter = require("./routes/medicine");
// app.use("/medicine",medicineRouter);



// let rawdata = fs.readFileSync('./data/user.json');
// let student = JSON.parse(rawdata);
// console.log(student);

app.listen(3000);