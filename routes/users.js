const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.query.name);
  res.status(200).json({});
});

router.get("/new", (req, res) => {
  res.render("users/new", { firstName: "Test" });
  //res.send("User new form");
});

router.post("/", (req, res) => {
  console.log(req.body.firstname);
  //res.send("Hi");

  let isValid = true;
  if (isValid) {
    users.push({ firstName: req.body.firstname });
    res.redirect(`/users/${users.length - 1}`);
  } else {
    console.log("Error");
    res.render("users/new", { firstName: req.body.firstname });
  }
});

router.get("/:id", (req, res) => {
  console.log(req.user);
  res.send(`Get the user with ID ${req.params.id}`);
});
router.put("/:id", (req, res) => {
  res.send(`Update the user with ID ${req.params.id}`);
});
router.delete("/:id", (req, res) => {
  res.send(`Delete the user with ID ${req.params.id}`);
});

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}

const users = [{ name: "sachintha" }, { name: "john" }];
router.param("id", (req, res, next, id) => {
  console.log(id);
  req.user = users[id];
  next();
});

module.exports = router;
