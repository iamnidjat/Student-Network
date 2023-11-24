function isAdmin(req) {
    return req.session.user && req.session.user.role === 'admin';
};

const isAdminMiddleware = (req, res, next) => {
    if (!isAdmin(req)) {
        console.log("Permission is denied!\nYou are not logged in or not an admin!");
        return res.status(403).send("Permission is denied!\nYou are not logged in or not an admin!");
    }

    next();
};

module.exports = isAdminMiddleware;