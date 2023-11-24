const express = require('express');
const session = require('express-session');
const multer = require('multer');
const isUserMiddleware = require('../middlewares/isUserMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Look at the profile dashboard
router.get('/profile-dashboard', isUserMiddleware, (req, res) => {
  try
  {
    res.send(`
        Welcome, ${req.session.user.username}!
        Email: ${req.session.user.email}
        Group: ${req.session.user.groupNumber}
        Name: ${req.session.user._name}
        Surname: ${req.session.user.surname}
        About myself: ${req.session.user.aboutMyself}
        Phone number: ${req.session.user.phoneNumber}
        Interests: ${req.session.user.interests}
        Skills: ${req.session.user.skills}
        Academic Achievments: ${req.session.user.acadAchievments}
        Birthday: ${req.session.user.birthday}
        User avatar: ${req.session.user.userAvatar}
      `);
  } 
  catch (error) 
  {
    res.status(500).json({ error: error.message });
  }
});

//Edit data in the profile dashboard (use form-data (not x-www-form-data) in POSTMAN)
router.patch('/edit-profile-dashboard', isUserMiddleware, upload.single('userAvatar'), async (req, res) => {
    try 
    {
      const id = req.session.user.id;
      const { _name, surname, aboutMyself, groupNumber, phoneNumber,
         birthday, interests, skills, acadAchievments } = req.body;

      let userAvatar = null;

      if (req.file) {
        userAvatar = req.file.buffer; 
        }

      const { rows } = await pool.query(
        'UPDATE users SET _name = $1, surname = $2, aboutMyself = $3, groupNumber = $4, phoneNumber = $5, birthday = $6, ' 
        + 'userAvatar = $7, interests = $8, skills = $9, acadAchievments = $10 WHERE id = $11 RETURNING *',
        [_name, surname, aboutMyself, groupNumber, phoneNumber, birthday, userAvatar, interests, skills, acadAchievments, id]
      );

      console.log('Congratulations! You updated your data!');
      res.json(rows[0]);
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;
