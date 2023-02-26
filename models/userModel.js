const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        min: 2,
        max: 20,
        required: true
    },
    lastName: {
        type: String,
        min: 2,
        max: 20,
        required: true
    },
    password: {
        type: String,
        min: 2,
        max: 20,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        min: 2,
        max: 20,
        unique: true,
        required: true
    },
    picture: {
        type: Object,
        default: {}
    },
    country: {
        type: String,
        min: 2,
        max: 20,
        required: true
    },
    city: {
        type: String,
        min: 2,
        max: 20,
        required: true
    },
    gender: {
        type: String,
        min: 2,
        max: 20,
        required: true
    },
    confirmed: {
        type: Number,
        required:true
    },
    activated: {
        type: Boolean,
        default:false
    },
    nationality: {
        required: true,
        type: String,
    },
}, { timestamps: true });

//sign-up functionality
userSchema.statics.signUp = async function (info) {
    const { firstName, lastName,age, email, gender, confirmed,city, country, nationality, password, picture } = info;
    if (!validator.isEmail(email)) throw Error("please use a valid email to register");
    if (!firstName) throw Error("sorry first name field must be filled to register");
    if (!lastName) throw Error("sorry last name field must be filled to register");
    if (!gender) throw Error("please fill the gender field");
    if (!city) throw Error("please fill up the field");
    if (!country) throw Error("please enter your current country name");
    if (!nationality) throw Error("nationality is required ");
    if (!password) { throw Error('you can not have account without password so fill the password field ') } else if (password.length <= 4 ){
        throw Error('please a strong password more 4 charaicters or digit or symbols')
    };
    if (!age) {
        throw Error("sorry age is required")
    } else if (age < 18) throw Error("sorry you can not create an account as long as your are under 18 :(");

    const inUse = await this.findOne({ email });
    if (inUse) throw Error("sorry this email is already in use you can not have more than 1 accounts with 1 email :(");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({
        email, firstName, lastName, country, nationality, password: hashedPassword,
        picture: picture ? {
            contentType: picture.mimetype,
            img: picture.buffer.toString("base64"),
            
        }:{},gender,city,age,confirmed
    })
    const sav = await user.save()
    return sav;

}
//log-in functionality
userSchema.statics.logIn = async function ({ email, password }) {
    if (!password || !email) throw Error('sorry you must fill all field to log-in');
    const matched = await this.findOne({activated:true,email:email});
    if (!matched) throw Error("incorrect email please check your email again !...");

    const confirm = await bcrypt.compare(password, matched.password);
    if (!confirm) throw Error('incorrect password please try again ');

    return matched;
}
module.exports = mongoose.model("User", userSchema);
