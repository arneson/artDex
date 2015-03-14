var auth = {};
auth.loggedIn = function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect(201,'/login');
    }
}
//auth.loggedIn = loggedIn;
module.exports = auth;