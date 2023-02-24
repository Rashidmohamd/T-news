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
app.use(cors({origin:"https://dulcet-brioche-c4c7ad.netlify.app"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized:true,
//     store: sessionStore.create({
//         mongoUrl: process.env.DBuri,
//         ttl: 1000 * 60 * 60 * 24,
//         collectionName: "sessions",
//         mongoOptions:{useUnifiedTopology:true}
//     }),
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24
//     }
// }));
//Routes
app.use('/TG-news', userRouter);
app.use("/TG-news", commentRouter);
app.use("/TG-news", articaleRouter);
app.use("/TG-news", likeRoute);

const port = process.env.PORT || 8000;
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