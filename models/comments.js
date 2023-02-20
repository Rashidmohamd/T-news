const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        min: 2,
    },
    userId: {
        type: String,
        required: true,
    },
    articaleId: {
        required: true,
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("comment", commentSchema);
