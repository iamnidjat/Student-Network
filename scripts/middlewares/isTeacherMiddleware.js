function isTeacher(req) {
  return req.session.user && req.session.user.role === 'teacher';
};

const isTeacherMiddleware = (req, res, next) => {
  if (!isTeacher(req)) {
      console.log("Permission is denied!\nYou are not logged in or not a teacher!");
      return res.status(403).send("Permission is denied!\nYou are not logged in or not a teacher!");
  }

  next();
};

module.exports = isTeacherMiddleware;