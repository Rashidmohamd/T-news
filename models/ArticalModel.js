const mongoose = require("mongoose");

const ArticaleSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    userId: {
        type:String,
        required: false
    },
    img: {
        type: Object,
        default: {}
    },
    comments: {
        type: Number,
        default:0
    },
    likes: {
        type: Number,
        default:0
    }
}, { timestamps: true });

module.exports = mongoose.model("articale", ArticaleSchema);