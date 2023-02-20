const con = require("../controlers/likesControler");
const express = require("express");
const router = express.Router();
router.post("/like/:id", con.toggleLike);
router.get('/likes',con.getLikes)
module.exports = router;