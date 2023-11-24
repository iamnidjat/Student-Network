function isUser(req) {
    return req.session.user;
  };

const isNotUserMiddleware = (req, res, next) => {
    if (isUser(req)) {
        console.log("You are already logged in!\nIf you want to register a new user or log in, log out first!");
        return res.status(403).send("You are already logged in!\nIf you want to register a new user or log in, log out first!");
    }

    next();
};


module.exports = isNotUserMiddleware;