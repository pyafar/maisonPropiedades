const userLogged = (req, res, next)=>{

    res.locals.isLogged = false;

    let userLogged = req.session.user;

    if(userLogged){
        res.locals.isLogged = true;
        res.locals.userLogged = userLogged;
    }

    next();
}

module.exports = userLogged;