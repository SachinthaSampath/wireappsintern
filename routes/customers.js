const express = require("express");
const router = express.Router();

router
  .route("/:id")
  .get((req, res) => {
    res.send(`Get Customer with ID ${req.params.id}`);
  })
  .put((req, res) => {
    res.send(`Update Customer with ID ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Delete Customer with ID ${req.params.id}`);
  });

  module.exports = router;