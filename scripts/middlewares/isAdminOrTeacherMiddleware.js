

function isAdminOrTeacher(req) {
  return req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'teacher');
};

const isAdminOrTeacherMiddleware = (req, res, next) => {
  if (!isAdminOrTeacher(req)) {
    console.log("Permission is denied!\nYou are not logged in or not a teacher or an administrator!");
    return res.status(403).send("Permission is denied!\nYou are not logged in or not a teacher or an administrator!");
  }

  next();
};


module.exports = isAdminOrTeacherMiddleware;