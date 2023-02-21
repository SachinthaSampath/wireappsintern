const express = require("express");
const app = express();

//show static HTML
app.use(express.static("public"));
app.use(express.urlencoded());

function logger(req,res,next){
    console.log(req.originalUrl);
    next();
}
// app.use(logger);


app.set("view engine", "ejs");

app.get("/",logger,logger,logger, (req, res, next) => {
    console.log("here");
    // res.download('index.html');
    // res.status(500).send("Hi");
    // res.status(500).json({"name":"sachintha"});
    res.render("index", { text: "world" });
});

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const customerRouter = require("./routes/customers");
const exp = require("constants");
app.use("/customers", customerRouter);

app.listen(3000);


