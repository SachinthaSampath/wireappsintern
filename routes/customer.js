const express = require("express");
const router = express.Router();
const fs = require("fs");

//send all the customer data as json
router.get("/", (req, res) => {
  //read customers from json file
  let result = [];
  let customers = getCustomersFromFile();

  //loop through each element to find whether deleted
  customers.forEach((element) => {
    if (element.deleted == 0) {
      result.push(element);
    }
  });
  res.status(200).json(result);
});

//search customers
router.get("/search/:term", (req, res) => {
  //read customers from json file
  let result = [];
  let customers = getCustomersFromFile();
  //search term
  let term = req.params.term;

  //loop through each element
  customers.forEach((element) => {
    if (element.deleted == 0 && element.name.includes(term)) {
      result.push(element);
    }
  });
  res.status(200).json(result);
});

//create customer form
router.get("/new", (req, res) => {
  //show customer form
  res.render("customer/new", {
    id: "",
    name: "",
    address: "",
    nic: "",
    dob: "",
    regdate: "",
    telephone: "",
    job: "",
    active: "checked",
    deleted: 0,
  });
});

//create customer
router.post("/", (req, res) => {
  //read the customer list
  let customers = getCustomersFromFile();
  //current customer count
  let customerCount = customers.length;
  //new customer id
  let newId = customerCount + 1;
  //create new customer object
  let newCustomer = {
    id: newId,
    name: req.body.name,
    address: req.body.address,
    nic: req.body.nic,
    dob: req.body.dob,
    regtime: req.body.regtime,
    telephone: req.body.telephone,
    job: req.body.job,
    active: req.body.active == "on" ? 1 : 0,
    deleted: 0,
  };

  //append to customer arrray
  customers.push(newCustomer);
  //stringify data
  let data = JSON.stringify(customers, null, 2);
  //write customer list
  fs.writeFileSync("./data/customer.json", data);

  //redirect
  res.redirect(`/customer/${customers.length}`);
});

//update customer form
router.get("/update/:id", (req, res) => {
  //read customers
  let customers = getCustomersFromFile();
  //customer ID to find
  let findId = req.params.id;

  //loop through customers
  customers.forEach((c) => {
    if (c.id == findId && c.deleted == 0) {
      //found customer
      res.render("customer/update", c);
      return;
    }
  });
  //customer with ID not found
  res.send("Invalid customer ID");
});

//update customer
router.post("/update/:id", (req, res) => {
  //update customer
  //read the customer list
  let customers = getCustomersFromFile();

  //customer ID to find
  let findId = req.params.id;

  let updateCustomer;
  //loop through customers
  customers.forEach((c) => {
    if (c.id == findId && c.deleted == 0) {
      //found customer
      updateCustomer = c;
      return;
    }
  });
  if (updateCustomer) {
    //found customer
    updateCustomer.name = req.body.name;
    updateCustomer.address = req.body.address;
    updateCustomer.nic = req.body.nic;
    updateCustomer.dob = req.body.dob;
    updateCustomer.telephone = req.body.telephone;
    updateCustomer.job = req.body.job;
    updateCustomer.active = req.body.active == "on" ? 1 : 0;

    //stringify data
    let data = JSON.stringify(customers, null, 2);
    fs.writeFileSync("./data/customer.json", data);

    //redirect
    res.redirect(`/customer/${updateCustomer.id}`);
  } else {
    //unable to find customer
    res.send("Unable to find customer");
  }
});

//delete customer with post request (permanent delete)
router.post("/delete/:id", (req, res) => {
  //delete customer with id
  let id = req.params.id;
  //read the customer list
  let customers = getCustomersFromFile();
  //final customer list
  let writeList = [];
  //status flag
  let found = false;
  //loop through customers
  customers.forEach((element) => {
    //add customer to the list if the id doesn't match
    if (element.id != id) {
      writeList.push(element);
    } else {
      found = true;
    }
  });

  //stringify data
  let data = JSON.stringify(writeList, null, 2);
  //write finalized customer list
  fs.writeFileSync("./data/customer.json", data);

  if (found) {
    res.send("Successfully deleted!");
  } else {
    res.send("Unable to find customer!");
  }
});

//default routes
router
  .route("/:id")
  .get((req, res, next) => {
    //show customer with a specific id
    let id = req.params.id;
    //read the customer list
    let customers = getCustomersFromFile();
    //status flag
    let found = false;
    customers.forEach((element) => {
      if (element.id == id && element.deleted == 0) {
        res.status(200).json(element);
        found = true;
        return;
      }
    });
    if (!found) res.status(200).json({});
  })
  .put((req, res, next) => {})
  .delete((req, res, next) => {
    //delte customer with delete request (soft delete)
    let id = req.params.id;
    //status flag
    let found = false;
    //read the customer list
    let customers = getCustomersFromFile();
    customers.forEach((element) => {
      if (element.id == id) {
        element.deleted = 1;
        found = true;
      }
    });
    if (found) {
      //stringify data
      let data = JSON.stringify(customers, null, 2);
      fs.writeFileSync("./data/customer.json", data);
      res.send("Successfully deleted!");
    } else {
      res.send("Unable to find customer!");
    }
  });

//helper function to read customers from the file
const getCustomersFromFile = () => {
  let rawdata = fs.readFileSync("./data/customer.json");
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
