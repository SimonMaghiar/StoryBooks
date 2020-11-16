module.exports = {
    ensureAuth: function (req,res,next){    //<--Prevents user to go back to login page from dashboard when it's logged in
        if(req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/');
        }
    },
    ensureGuest: function(req,res,next){    //<--Prevents user to jump to /dashboard without being logged in
        if(req.isAuthenticated()){
            res.redirect('/dashboard');
        }else{
            return next();
        }
    }
}