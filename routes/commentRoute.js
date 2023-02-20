const con = require("../controlers/commentControler");
const express = require("express");
const router = express.Router();
const authorize = require('../middleware/userMiddle');

router.use(authorize);
router.get('/get-comments/:id', con.getAll);
router.post("/add-comment/:id", con.addComment);
router.get("/get-comment/:id", con.getCommment);
router.put("/update-comment/:id", con.updateComment);
router.delete('/delete-comment/:id', con.deleteComment);
module.exports=router