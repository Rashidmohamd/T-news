const jwt = require('jsonwebtoken');

const authorize = async (req, res, next) => {
    try {
        if(!req.headers.authorization)throw Error("unauthorized please the json token with req headers")
        const token = req.headers.authorization.split(' ')[1];
        const { _id } = jwt.verify(token, process.env.INNER_SECRET);
        
        if (_id) {
            req.userId = _id;
            next()
        };
    } catch (err) {
        res.status(401).json({error:err.message})
    }
}


module.exports = authorize;