const express = require("express");
const app = express();
const fs = require("fs");

const cookieParser = require('cookie-parser')
app.use(cookieParser());
const session = require("express-session");
//set session middleware
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);


//set view engine - to render web pages using templates
app.set("view engine", "ejs");

//set public folder
app.use(express.static("public"));

//use middleware to handle incomming payloads
app.use(express.urlencoded());

//set user router
const userRouter = require("./routes/user");
app.use("/user", userRouter);

//set customer router
const customerRouter = require("./routes/customer");
app.use("/customer", customerRouter);

//set medicine router
const medicineRouter = require("./routes/medicine");
app.use("/medicine", medicineRouter);

app.listen(3000);
