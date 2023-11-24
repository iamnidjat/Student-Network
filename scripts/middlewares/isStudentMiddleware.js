function isStudent(req) {
  return req.session.user && req.session.user.role === 'student';
};

const isStudentMiddleware = (req, res, next) => {
  if (!isStudent(req)) {
    console.log("Permission is denied!\nYou are not logged in or not a student!");
    return res.status(403).send("Permission is denied!\nYou are not logged in or not a student!");
  }

  next();
};

module.exports = isStudentMiddleware;