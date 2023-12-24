const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const databaseUrl = "mongodb://127.0.0.1:27017/ELCY";



//use middleware
app.use(express.json()); // this to active send data with json type
app.use(express.urlencoded({ extended: false })); // this to active send data with form type


//connect to mongoDB and start listen on port
mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log("Connected to ELCY!");
    app.listen(port, () => {
      console.log("listen on port 3000 in local host");
    });
  })
  .catch(() => console.log(error));


//routes
app.get("/", (request, response) => {
  res.send("node api");
});

const loginRoute = require("./route/loginRoute");
const signupRoute = require("./route/signupRoute");
const forgotPasswordRoute = require("./route/forgotPasswordRoute");
const serviceRoute = require("./route/serviceRoute");
const categoryRoute = require("./route/categoryRoute");
const companyRoute = require("./route/companyRoute");

app.use("/api", loginRoute);
app.use("/api", signupRoute);
app.use("/api", forgotPasswordRoute);
app.use("/api", serviceRoute);
app.use("/api", categoryRoute);
app.use("/api", companyRoute);