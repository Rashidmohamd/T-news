const Comment = require("../models/comments");
const Article = require('../models/ArticalModel');

//add comment controler funtion
const addComment = async (req, res) => {
    const {id}    = req.params;
    const { userId } = req;
    const body = req.body.comment;
    try {
        const created = await Comment.create({
            body,
            userId,
            articaleId:id
        })
        const sav = await created.save();
        if (sav) {
            const art = await Article.findByIdAndUpdate(id, {
                $inc: {
                    comments: 1
                }
            })

            art.save();
        }
        res.status(201).json(sav)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
//deleting comment controler function
const deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const deleted = await Comment.findOneAndDelete({ _id: id, userId });
        if (!deleted) throw Error("not found ");
        const art = await Article.findByIdAndUpdate(deleted.articaleId, {
            $inc: {
                comments: - 1
            }
        })
        const sa = await art.save();
        if (sa) { res.send(deleted) } else {
           throw Error('sorry something went wrong')
        };
        
    } catch (err) {
        res.status(404).json({error:err.message})
    }

}

// update comment 
const updateComment = async (req, res) => {
    const { id } = req.params;
    const { userId } = req;
    const body = req.body.comment;
    try {
        if(!body)throw Error("sorry you can not leave it empty")
        const updated = await Comment.findOneAndUpdate({ userId, _id: id }, {
            $set: {
                body:body
            }
        });
        const sav = await updated.save();
        res.status(201).json(sav)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
//get single comment
const getCommment = async (req, res) => {
    const { id } = req.params;
    try {
        const found = await Comment.findOne({_id:id,userId:req.userId});
        res.status(200).json(found)
    } catch (err) {
        res.status(404).json({error:err.json})
    }
}
//get all comments
const getAll = async (req, res) => {
    const { id } = req.params;
    try {
        const found = await Comment.find({ articaleId: id })
        res.send(found);
    } catch (err) {
        res.status(401).json({error:err.message})
    }
}
module.exports = {
    addComment,
    getCommment,
    getAll,
    deleteComment,
    updateComment
}