const express = require("express");
const router = express.Router();
const fs = require("fs");

//send all the medicine data as json
router.get("/", (req, res) => {
  //read medicines from json file
  let result = [];
  let medicines = getMedicinesFromFile();

  //loop through each element to find whether deleted
  medicines.forEach((element) => {
    if (element.deleted == 0) {
      result.push(element);
    }
  });
  res.status(200).json(result);
});

//search medicines
router.get("/search/:term", (req, res) => {
  //read medicines from json file
  let result = [];
  let medicines = getMedicinesFromFile();
  //search term
  let term = req.params.term;

  //loop through each element
  medicines.forEach((element) => {
    if (element.deleted == 0 && element.name.includes(term)) {
      result.push(element);
    }
  });
  res.status(200).json(result);
});

//create medicine form
router.get("/new", (req, res) => {
  //show medicine form
  res.render("medicine/new", {
    id: "",
    name: "",
    description: "",
    qty: "",
    supplier: "",
    dosage: "",
    mfd: "",
    exp: "",
  });
});

//create medicine
router.post("/", (req, res) => {
  //read the medicine list
  let medicines = getMedicinesFromFile();
  //current medicine count
  let medicineCount = medicines.length;
  //new medicine id
  let newId = medicineCount + 1;
  //create new medicine object
  let newmedicine = {
    id: newId,
    name: req.body.name,
    description: req.body.description,
    qty: req.body.qty,
    supplier: req.body.supplier,
    dosage: req.body.dosage,
    mfd: req.body.mfd,
    exp: req.body.exp,
    deleted: 0,
  };

  //append to medicine arrray
  medicines.push(newmedicine);
  //stringify data
  let data = JSON.stringify(medicines, null, 2);
  //write medicine list
  fs.writeFileSync("./data/medicine.json", data);

  //redirect
  res.redirect(`/medicine/${medicines.length}`);
});

//update medicine form
router.get("/update/:id", (req, res) => {
  //read medicines
  let medicines = getMedicinesFromFile();
  //medicine ID to find
  let findId = req.params.id;
  //status flag
  let found = false;
  //loop through medicines
  medicines.forEach((c) => {
    if (c.id == findId && c.deleted == 0) {
      //found medicine
      res.render("medicine/update", c);
      found = true;
      return;
    }
  });
  if (!found) {
    //medicine with ID not found
    res.send("Invalid medicine ID");
  }
});

//update medicine
router.post("/update/:id", (req, res) => {
  //update medicine
  //read the medicine list
  let medicines = getMedicinesFromFile();

  //medicine ID to find
  let findId = req.params.id;

  let updatemedicine;
  //loop through medicines
  medicines.forEach((c) => {
    if (c.id == findId && c.deleted == 0) {
      //found medicine
      updatemedicine = c;
      return;
    }
  });
  if (updatemedicine) {
    //found medicine
    updatemedicine.name = req.body.name;
    updatemedicine.description = req.body.description;
    updatemedicine.qty = req.body.qty;
    updatemedicine.supplier = req.body.supplier;
    updatemedicine.dosage = req.body.dosage;
    updatemedicine.mfd = req.body.mfd;
    updatemedicine.exp = req.body.exp;

    //stringify data
    let data = JSON.stringify(medicines, null, 2);
    fs.writeFileSync("./data/medicine.json", data);

    //redirect
    res.redirect(`/medicine/${updatemedicine.id}`);
  } else {
    //unable to find medicine
    res.send("Unable to find medicine");
  }
});

//delete medicine with post request (permanent delete)
router.post("/delete/:id", (req, res) => {
  //delete medicine with id
  let id = req.params.id;
  //read the medicine list
  let medicines = getMedicinesFromFile();
  //final medicine list
  let writeList = [];
  //status flag
  let found = false;
  //loop through medicines
  medicines.forEach((element) => {
    //add medicine to the list if the id doesn't match
    if (element.id != id) {
      writeList.push(element);
    } else {
      found = true;
    }
  });

  //stringify data
  let data = JSON.stringify(writeList, null, 2);
  //write finalized medicine list
  fs.writeFileSync("./data/medicine.json", data);

  if (found) {
    res.send("Successfully deleted!");
  } else {
    res.send("Unable to find medicine!");
  }
});

//default routes
router
  .route("/:id")
  .get((req, res, next) => {
    //show medicine with a specific id
    let id = req.params.id;
    //read the medicine list
    let medicines = getMedicinesFromFile();
    //status flage
    let found = false;
    medicines.forEach((element) => {
      if (element.id == id && element.deleted == 0) {
        res.status(200).json(element);
        found = true;
        return;
      }
    });
    if (!found) {
      res.status(200).json({});
    }
  })
  .put((req, res, next) => {})
  .delete((req, res, next) => {
    //delte medicine with delete request (soft delete)
    let id = req.params.id;
    //status flag
    let found = false;
    //read the medicine list
    let medicines = getMedicinesFromFile();
    medicines.forEach((element) => {
      if (element.id == id) {
        element.deleted = 1;
        found = true;
        return;
      }
    });
    if (found) {
      //stringify data
      let data = JSON.stringify(medicines, null, 2);
      fs.writeFileSync("./data/medicine.json", data);
      res.send("Successfully deleted!");
    } else {
      res.send("Unable to find medicine!");
    }
  });

//helper function to read medicines from the file
const getMedicinesFromFile = () => {
  let rawdata = fs.readFileSync("./data/medicine.json");
  return JSON.parse(rawdata);
};

module.exports = router;
