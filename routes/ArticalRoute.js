const express = require("express");
const router = express.Router();
const con = require("../controlers/ArticalContoler");
const multer = require("multer");
const authorize = require('../middleware/userMiddle')

const storage = multer.memoryStorage();
const image = multer({storage})

router.use(authorize);
router.get("/articales", con.getAllArticales);
router.get("/get-my-articales/:id", con.getMyArticale);
router.get("/get-articale/:id", con.getingSingle);
router.post("/add-articale", image.single("image"), con.createArticale);
router.put("/update-articale/:id",image.single('image'), con.updateArticale);
router.delete("/delete-articale/:id", con.deleteArticale);

module.exports = router;