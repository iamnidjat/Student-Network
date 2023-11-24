function isUser(req) {
  return req.session.user;
};

const isUserMiddleware = (req, res, next) => {
  if (!isUser(req)) {
      console.log("Permission is denied!\nYou are not logged in!");
      return res.status(403).send("Permission is denied!\nYou are not logged in!");
  }

  next();
};

module.exports = isUserMiddleware;