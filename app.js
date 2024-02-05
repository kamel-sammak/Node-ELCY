const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;
const databaseUrl = "mongodb://127.0.0.1:27017/ELCY";
const path = require('path');



const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//use middleware
app.use(express.json()); // this to active send data with json type
app.use(express.urlencoded({ extended: false })); // this to active send data with form type
app.use(cors());


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
const postRoute = require("./route/postRoute");
const imageRoute = require("./route/ImageRoute");
const MedicalCategoryRoute = require("./route/MedicalCategoryRoute");
const GroupRoute = require("./route/GroupRoute");
const DrugRoute = require("./route/DrugsRoute");
const MedicalPost = require("./route/MedicalPostRoute");
const customer = require("./route/customerRoute");
const cv = require("./route/cvRoute");
const admin = require("./route/adminRoute");
const problemSolving = require("./route/problemSolvingRoute");

app.use("/api", loginRoute);
app.use("/api", signupRoute);
app.use("/api", forgotPasswordRoute);
app.use("/api", serviceRoute);
app.use("/api", categoryRoute);
app.use("/api", companyRoute);
app.use("/api", postRoute);
app.use('/api', imageRoute);
app.use("/api", MedicalCategoryRoute);
app.use("/api", GroupRoute);
app.use("/api", DrugRoute);
app.use("/api", MedicalPost);
app.use("/api", customer);
app.use("/api", cv);
app.use("/api", admin);
app.use("/api", problemSolving);