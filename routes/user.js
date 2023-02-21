const express = require("express");
const router = express.Router();
const fs = require("fs");

//send all the user data as json
router.get("/", (req, res) => {
  //read users from json file
  let result = [];
  let rawdata = fs.readFileSync("./data/user.json");
  let student = JSON.parse(rawdata);

  //loop through each element to find whether deleted
  student.forEach((element) => {
    if (element.deleted == 0) {
      result.push(element);
    }
  });
  res.status(200).json(result);
});

//create user form
router.get("/new", (req, res) => {
  res.render("user/new", {
    id: "",
    name: "",
    username: "",
    password: "",
    role: "",
    active: "",
    deleted: 0,
  });
});

//create user
router.post("/", (req, res) => {
  //read the user list synchronous
  let rawdata = fs.readFileSync("./data/user.json");
  let users = JSON.parse(rawdata);
  let userCount = users.length;
  let newId = userCount + 1;

  let newUser = {
    id: newId,
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    active: req.body.active == "checked" ? 1 : 0,
  };

  //appedn to user arrray
  users.push(newUser);
  //stringify data
  let data = JSON.stringify(users, null, 2);
  fs.writeFileSync("./data/user.json", data);

  //redirect
  res.redirect(`/user/${users.length}`);
});

//user login
router.post("/login", (req, res, next) => {});

//default routes
router
  .route("/:id")
  .get((req, res, next) => {
    //show user with a specific id
    let id = req.params.id;
    //read the user list synchronous
    let rawdata = fs.readFileSync("./data/user.json");
    let users = JSON.parse(rawdata);
    users.array.forEach((element) => {
      if (element.id == id) {
        res.status(200).json(element);
        return;
      }
    });
    res.status(200).json({});
  })
  .put((req, res, next) => {})
  .delete((req, res, next) => {
    //*********** check *******/
    //delete user with id
    let id = req.params.id;
    //read the user list synchronous
    let rawdata = fs.readFileSync("./data/user.json");
    let users = JSON.parse(rawdata);
    users.array.forEach((element) => {
      if (element.id == id) {
        element.delete = 1;
      }
    });

    //stringify data
    let data = JSON.stringify(users, null, 2);
    fs.writeFileSync("./data/user.json", data);

    res.status(200).json({});
  });

module.exports = router;

//res.status(200).json(userCount);

//read the user list asynchronous
//   fs.readFile("./data/user.json",(err,data)=>{
//     if(err){
//         throw err;
//     }else{
//         let students = JSON.parse(data);
//         console.log(students);
//         res.send(students);
//     }
//   })
//console.log("This is after call");
