require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const articaleRouter = require("./routes/ArticalRoute");
const commentRouter = require("./routes/commentRoute");
const likeRoute = require("./routes/likesRoute");

const app = express();
// middlewares
app.use(cors({origin: process.env.ALLOWED_ENDPOINT}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Routes
app.use('/TG-news', userRouter);
app.use("/TG-news", commentRouter);
app.use("/TG-news", articaleRouter);
app.use("/TG-news", likeRoute);

const port = process.env.Port || 8000;
//connecting to db and listening
mongoose.connect(process.env.DBuri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log('connected to the DB successfully ....');
        app.listen(port, (err) => {
            if (err) console.log(err);
            console.log(`listening on port ${port} successfully ....`)
        })
    })
    .catch(err => console.log(err));