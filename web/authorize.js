/**
 * Created by Alex on 9/26/2015.
 */
module.exports = function(req, res, next){
    if (!req.user)
        res.sendStatus(401);
    else
        next();
};