const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const nodemailer = require("nodemailer")
const bc = require('bcrypt');
const Articale = require("../models/ArticalModel");
const Likes = require("../models/likes");
const Comments = require('../models/comments');

const deleteUnactivatedUsers = async () => {
    const CurrentTime = new Date();
    const milliseconds = CurrentTime.getTime();
    const expired = milliseconds - 1000 * 60*60;
    await User.deleteMany({ activated: false, createdAt: { $lt: expired } });
   
}
// automatic delete process intervole for un active users
setInterval(deleteUnactivatedUsers, 1800000)
const deleteOldUsers = async () => {
    const today = new Date();
    const toMilliseconds = today.getTime();
    const week = toMilliseconds - 1000 * 60 * 60 * 24 * 10;
    const getUsers = await User.find({ createdAt: { $lt: week } }).select(['-picture']);
    if (getUsers) getUsers.map(async (u) => {
        await Articale.find({ userId: u._id });
        await Comments.find({ userId: u._id });
        await Likes.find({ userId: u._id });
     
    });

}
//deleting old users
setInterval(deleteOldUsers,18000000);
// transporter for sending email
const transproter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.user,
        pass:process.env.pass
    }
})
//token genrater
const token = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET,{expiresIn:"10h"});
}
//inner token
const innerToken = (_id) => {
    return jwt.sign({_id},process.env.INNER_SECRET,{expiresIn:"7d"})
}
//sign in controler
const sign = async (req, res) => {
    const { firstName, lastName, email, gender, age, city, country, nationality, password } = JSON.parse(req.body.Info);
    let code = Math.floor(Math.random() * 99999 + 109090);
    try {
        const create = await User.signUp({ firstName, lastName, age, picture: req.file, email, gender, city, country, nationality, password ,confirmed:code});
        if (create) {
            
            const info = await transproter.sendMail({
                from: "'TG news' <rashid7252000@gmail.com>",
                to: create.email,
                subject:"verification code",
                text: "welcome to TG news blog",
                html:`<h1>here is your code please use this (${code})verification code to activate your account as soon as possible, it will be expired in an hour if you do not use it </h1>`
            })
            const tkn = token(create._id);
            if (info) {
                res.send({msg:"please check your email in-box we have sent the verifation code and it will be expired in an hour ",token:tkn})
            }
        }
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
//activating account controler
const activating = async (req, res) => {
    try {
        const { verifyCode } = req.body;
        if (!verifyCode) throw Error("you must send verification code which we send your email account  ...");
        const tkn = req.headers.authorization.split(" ")[1];
        const { _id } = jwt.verify(tkn, process.env.SECRET);
        const user = await User.findOneAndUpdate({ _id,confirmed:verifyCode }, {
            $set: {
                activated:true
            }
        });
        if(!user) throw Error("sorry can only use a valid code")
        const innertokn = innerToken(_id);
        if(!user)throw Error('sorry this user is already activated')
        if (user.confirmed === verifyCode) {
            const { email, firstName, lastName, age, country, city, gender, nationality, picture, createdAt, updatedAt } = user;
            res.status(201).json({ email, firstName, lastName, age, country, city, gender, nationality, picture, createdAt, updatedAt, token: innertokn });
        }
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
//forgot password controler
const forgot = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const info = await transproter.sendMail({
                from: "'TG news ' <rashid7252000@gmail.com>",
                to: user.email,
                subject: "verification code",
                text: "use this code to log in your account then you can modify your password later when log-in",
                html:`<h1>here is your vrefication code ${user.confirmed}</h1>`
            })
            if (info) {
                const tkn = token(user._id);
                res.send({ msg: "the verification code has been sent to your email account check your inbox to use it for loging in ", token: tkn });
            }
        } else {
            throw Error("no user found")
        }
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
//loging in controler
const log = async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await User.logIn({ password, email });
        if (user) {
            const { email, firstName, lastName, age, country, city, gender, nationality, picture, createdAt, updatedAt, _id } = user;
            const tkn = innerToken(_id)
            res.status(201).json({ email, firstName, lastName, age, country, city, gender, nationality, picture,_id, createdAt, updatedAt,token:tkn})
        }
    } catch (err) {
        res.status(404).json({error:err.message})
    }
}
//log out controler
const logout = async (req, res) => {
    try {
        req.session.destory((err) => {
            if (err) throw Error(err);
            res.send('')
        })
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
//get me 
const getMe = async (req, res) => {
    try {
        const me = await User.findById(req.userId).select(["-password","-acrivated","-confirmed"])
        res.send(me);
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
//modify user not compeleted yet
const modifyMe = async (req, res) => {
    const file = req.file;
    const id = req.userId
    console.log(file);
    const { firstName, lastName, email, gender, age, city, country, nationality } = JSON.parse(req.body.Info);
    try {
        const modyfing = await User.findOne({_id:id}).select(['-password', '-confirmed', '-activated']);
        if (modyfing) console.log(modyfing);
        if (firstName && lastName && email && gender && age && city && country && nationality && file) {
        await  Object.assign(modyfing, {
            firstName, lastName, age, picture:{
                 contentType: file.mimetype,
                 img: file.buffer.toString("base64"),
            }, email, gender, city, country, nationality,});
        const sav = await modyfing.save();
        res.status(201).json(sav);
        } else if (firstName && lastName && email && gender && age && city && country && nationality && !file) {
              Object.assign(modyfing, {
            firstName, lastName, age,
            email, gender, city, country, nationality});
        const sav = await modyfing.save();
        res.status(201).json(sav);
        } else {
            throw Error("sorry you can replace adjust field but delete")
        }
    } catch (err) {
        res.status(400).json({error:`${err.message} from server`})
    }
}
//delete user not competed yet
const deleteMe = async (req, res) => {
    try {
        const re = await User.findByIdAndDelete(req.userId);
        if (re) res.send();
        throw Error("not found to delete")
    } catch (err) {
        res.status(401).json({error:err.message})
    }
}
//get all users
const allUsers = async(req, res) => {
    try {
        const users = await User.find().sort({createdAt:-1}).select(['-password','-confirmed','-activated'])
        res.send(users);
    } catch (err) {
        res.status(404).json({error:err.message})
    }
}

const resetPassword = async (req, res) => {
    const userId = req.userId;
    const { password } = req.body;
    try {
        if (!password) throw Error("sorry you are not allowed to reset your password with empty field");
        if (password.length <= 5) throw Error("please a bit strong password means more than 6 characters");
        const salt = await bc.genSalt(10);
        const hashPassword = await bc.hash(password,salt)
        const upd = await User.findByIdAndUpdate(userId, {
            $set: {
                password: hashPassword
            }
        });
        if (upd) res.send({ success: 'your password was successfully changed !' })
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
//exporting controlers 
module.exports = {
    sign,
    resetPassword,
    getMe,
    activating,
    forgot,
    log,
    logout,
    modifyMe,
    deleteMe,
    allUsers,
    modifyMe,
    deleteMe
}