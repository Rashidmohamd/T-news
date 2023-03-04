const Like = require('../models/likes');
const Article = require('../models/ArticalModel');
//toggling likes
const toggleLike = async (req, res) => {
    const { userId } = req;
    const articaleId = req.params.id;
    try {
        const exist = await Like.findOne({ userId, articaleId });
        if (exist) {
            const dle = await Like.findOneAndDelete({ userId, articaleId });
            if (dle) {
                const art = await Article.findByIdAndUpdate(articaleId, {
                    $inc: {
                        likes: -1
                    }
                })
                const sa = await art.save();
                if (sa) {
                    res.send(dle)
                }
            }
        } else {
            const addd = await Like.create({
                userId,
                articaleId
            })
            const sav = await addd.save();
            const art = await Article.findByIdAndUpdate(articaleId, {
                $inc: {
                    likes: 1
                }
            })
            const sa = await art.save();
            if (sa) {
                res.status(201).json(sav);
            }
        }
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
//get all likes route 
const getLikes = async (req, res) => {
    
    try {
        const fin = await Like.find(); 
        res.send(fin);
    } catch (err) {
        res.status(404).json({error:err.message})
    }
}
//exports controlers 
module.exports = {
    toggleLike,
    getLikes
}