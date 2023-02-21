const express = require("express");
const router = express.Router();
const fs = require("fs");

//send all the customer data as json
router.get("/", (req, res) => {
    //read customers from json file
    let result = [];
    let rawdata = fs.readFileSync("./data/customer.json");
    let student = JSON.parse(rawdata);

    //loop through each element to find whether deleted
    student.forEach((element) => {
        if (element.deleted == 0) {
            result.push(element);
        }
    });
    res.status(200).json(result);
});

//create customer form
router.get("/new", (req, res) => {
    res.render("customer/new", {
        "id": 1,
        "name": "sachintha",
        "address": "",
        "nic": "",
        "dob": "",
        "regdate": "",
        "telephone": "",
        "job": "",
        "active": 1,
        "deleted": 0
    });
});



//create customer
router.post("/", (req, res) => {
    //read the user list synchronous
    let rawdata = fs.readFileSync("./data/customer.json");
    let customers = JSON.parse(rawdata);
    let customerCount = customers.length;
    let newId = customerCount + 1;

    let newCustomer = {
        "id": newId,
        "name":req.body.name,
        "address":req.body.address,
        "nic": req.body.nic,
        "dob":req.body.dob,
        "regdate": req.body.regdate,
        "telephone":req.body.telephone,
        "job": req.body.job,
        "active": 1,
        "deleted": 0
    };

    //appedn to customer arrray
    customers.push(newCustomer);
    //stringify data
    let data = JSON.stringify(customers, null, 2);
    fs.writeFileSync("./data/customer.json", data);

    //redirect
    res.redirect(`/customer/${customers.length}`);
});


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
    .put((req, res, next) => { })
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
