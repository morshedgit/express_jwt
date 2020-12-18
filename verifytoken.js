const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send({error:true,from:'user verification',message:"Access denied"});

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (e) {
        res.status(400).send({error:true,from:'user verification',message:"Invalid token"});
    }
}

module.exports = auth;
