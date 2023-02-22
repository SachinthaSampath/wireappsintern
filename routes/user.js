const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");

//send all the user data as json
router.get("/", (req, res) => {
  //read users from json file
  let users = getUsersFromFile();

  let result = [];

  //loop through each element to find whether deleted
  users.forEach((element) => {
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
    active: "1",
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
    active: req.body.active == "on" ? 1 : 0,
  };

  //appedn to user arrray
  users.push(newUser);
  //stringify data
  let data = JSON.stringify(users, null, 2);
  fs.writeFileSync("./data/user.json", data);

  //redirect
  res.redirect(`/user/${users.length}`);
});

//update user
router.post("/update/:id", (req, res) => {
  //update user
  //read the user list
  let users = getUsersFromFile();
  //user ID to find
  let findId = req.params.id;
  //user to update
  let updateUser;
  //loop through users
  users.forEach((u) => {
    if (u.id == findId && u.deleted == 0) {
      //found user
      updateUser = u;
      return;
    }
  });

  if (updateUser) {
    //found user and update fields
    if (req.body.name) updateUser.name = req.body.name;
    if (req.body.username) updateUser.username = req.body.username;
    if (req.body.password) updateUser.password = req.body.password;
    if (req.body.role) updateUser.role = req.body.role;
    if (req.body.active) updateUser.active = req.body.active;

    //stringify data
    let data = JSON.stringify(users, null, 2);
    fs.writeFileSync("./data/user.json", data);

    //redirect
    res.redirect(`/user/${updateUser.id}`);
  } else {
    //unable to find user
    res.send("Unable to find user");
  }
});

//user login
router.post("/login", (req, res, next) => {
  
  //read users from json file
  let users = getUsersFromFile();
  //login credentials
  let username = req.body.username;
  let password = req.body.password;
  
  //status flag
  let loginSuccess = false;
  //loop through each element to find user with username
  users.forEach((element) => {
    if (
      element.username == username &&
      element.password == password &&
      element.active == 1 &&
      element.deleted == 0
      ) {
      loginSuccess = true;
      req.session.loggedInUser = JSON.stringify(element);
      return;
    }
  });
  
  //finalize with flag
  if (loginSuccess) {
    res.status(200).send("Login Success!");
  } else {
    res.status(200).send("Login Failed!");
  }
});

//default routes
router
  .route("/:id")
  .get((req, res, next) => {
    //show user with a specific id
    let id = req.params.id;
    //read the user list
    let users = getUsersFromFile();
    //status flag
    let userFound = false;
    //loop through users
    users.forEach((element) => {
      //find user with id and not deleted
      if (element.id == id && element.deleted == 0) {
        //show user
        userFound = true;
        res.status(200).json(element);
        return;
      }
    });
    //send error
    if (!userFound)
      res.status(200).send("Unable to find a user with the given id!");
  })

  .put((req, res, next) => {})

  .delete((req, res, next) => {
    //delete user with id
    let id = req.params.id;
    //status flag
    let found = false;
    //read the user list
    let users = getUsersFromFile();
    //loop through users
    users.forEach((element) => {
      if (element.id == id) {
        element.deleted = 1;
        found = true;
        return;
      }
    });
    if (found) {
      //stringify data
      let data = JSON.stringify(users, null, 2);
      fs.writeFileSync("./data/user.json", data);
      res.status(200).send("Successfully deleted!");
    } else {
      res.send("Unable to find user!");
    }
  });

//helper function to read users from the file
const getUsersFromFile = () => {
  let rawdata = fs.readFileSync("./data/user.json");
  return JSON.parse(rawdata);
};

//function to get logged in user role
const getUserRole = (req) => {
  if (req.session.loggedInUser) {
    let user = JSON.parse(req.session.loggedInUser);
    return user.role;
  } else {
    return "guest";
  }
};

module.exports = router;
