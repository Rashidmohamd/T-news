const Articale = require("../models/ArticalModel")
const Comment = require('../models/comments');
const Like = require('../models/likes');
// deleting automatically 
const deleteArticaleAuto = async () => {
    const today = new Date();
    const mines7 = today.getTime();
    const seven = mines7 - 1000 * 60 * 60*24*7 ;
    const delArt = await Articale.find({ createdAt: { $lt: seven } }).select(["-img"]);
    console.log(delArt)
    if (delArt) {
        delArt.map(d => {
            Articale.deleteMany({ createdAt: { $lt: seven } }).then(at=>console.log(at)).catch(err=>console.log(err.message))
            Comment.deleteMany({ articaleId: d._id }).then().catch(e => console.log(e.messsage))
            Like.deleteMany({ articaleId: d._id }).then().catch(err=>console.log(err.message))
        })
    }
}
setInterval(deleteArticaleAuto, 18000000);

//creating articale
const createArticale = async (req, res) => {
    try {
        const { userId } = req;
        const file = req.file;
        const { articale } = JSON.parse(req.body.articale)
        if (!articale && !file) {
            throw Error ('sorry you have to at least send something to create an articale it dose not matter wiether img or text')
        }
        const arti = await Articale.create({
            userId,
            body:articale,
            img: file ? {
                data: file.buffer.toString("base64"),
                contentType:file.mimetype
            }:{}
        })
        const sav = await arti.save();
        if (sav) {
            res.status(201).json(sav)
        }

    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
// get all articles
const getAllArticales = async (req, res) => {
    const { Block } = req.query;
    const count = 3;
    const skiping = Block * count;
    try {
        const arts = await Articale.find().sort({createdAt:-1}).skip(skiping).limit(count);
        if (arts.length <= 0) {
            res.status(200).json({ end: "no any more post  to show" })
        } else {
            res.send(arts)
        }
    } catch (err) {
        res.status(404).json({error:err.message})
    }
}
//delete articale
const deleteArticale = async(req, res)=> {
    const { id } = req.params;
    const { userId } = req;
    try {
        const deleted = await Articale.findOneAndDelete({ _id: id, userId }).select(['-img']);
        if (deleted) {
            await Comment.deleteMany({ articaleId: deleted._id});
            await Like.deleteMany({ articaleId: deleted._id });
            res.send(deleted);
        }
    } catch (err) {
        res.status(404).json({error:err.message})
    }
}
//geting a single articale
const getingSingle = async (req, res) => {
    const { id } = req.params;
    try {
        const found = await Articale.find({_id:id});
        res.send(found);
    } catch (err) {
        res.status(404).json({error:err.message})
    }
}
// updating articale
const updateArticale = async (req, res) => {
    const { id } = req.params;
    const { userId } = req
    try {
        const found = await Articale.findOne({ _id: id, userId })
        if (req.file && req.body.articale ){
            Object.assign(found, {
            body: JSON.parse(req.body.articale),
            img:{
                data: req.file.buffer.toString("base64"),
                contentType:req.file.mimetype
                }
            })
            const sav = await found.save();
            res.status(201).json(sav)
        } else if (!req.file && req.body.articale) {
            Object.assign(found, {
            body: JSON.parse(req.body.articale)
            })
            const sav = await found.save();
            res.status(201).json(sav)
        } else if (!req.body.articale && req.body) {
            Object.assign(found, {
            img:{
                data: req.file.buffer.toString("base64"),
                contentType:req.file.mimetype
                }
            })
            const sav = await found.save();
            res.status(201).json(sav)
        } else {
            throw Error("sorry you can not an empty files")
        }

    } catch (err) {
        res.status(404).json({error:err.message})
    }
}
const getMyArticale = async (req, res) => {
    try {
        const { id } = req.params;
        const getingMyArticales = await Articale.find({ userId: id }).sort({ updatedAt: 1 });
        res.send(getingMyArticales)
    } catch (err) {
        res.status(401).json({error:err.message})
    }
}
module.exports = {
    getAllArticales,
    getingSingle,
    createArticale,
    deleteArticale,
    updateArticale,
    getMyArticale
}