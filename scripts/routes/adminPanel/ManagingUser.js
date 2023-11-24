const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const isAdminMiddleware = require('../../middlewares/isAdminMiddleware');
const { pool } = require('../../database/dbSetup');
const router = express.Router();

//Getting all users
router.get('/admin/users', isAdminMiddleware, async (req, res) => {
    try
    {
      const result = await pool.query('SELECT * FROM users');
  
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Removing a user
  router.delete('/admin/remove-user', isAdminMiddleware, async (req, res) => {
    try
    {
      const { userId } = req.body;
  
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  
      res.json({ message: "User was deleted" });
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Altering a user
  router.patch('/admin/modify-user', isAdminMiddleware, async (req, res) => {
    try
    {
      const { _name, surname, email, username, _password, role, aboutMyself, groupNumber, 
        phoneNumber, interests, skills, acadAchievments, birthday, userAvatar, userId } = req.body;
        const hashedPassword = await bcrypt.hash(_password, 10);
  
      const { rows } = await pool.query(
        'UPDATE users SET _name = $1, surname = $2, email = $3, username = $4, _password = $5, role = $6, ' 
        + 'aboutMyself = $7, groupNumber = $8, phoneNumber = $9, interests = $10, '
        + 'skills = $11, acadAchievments = $12, birthday = $13, userAvatar = $14 WHERE id = $15 RETURNING *',
        [ _name, surname, email, username, hashedPassword, role, aboutMyself, groupNumber, 
          phoneNumber, interests, skills, acadAchievments, birthday, userAvatar, userId]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Adding a user
  router.post('/admin/add-user', isAdminMiddleware, async (req, res) => {
    try
    {
      const { email, username, _password, role } = req.body;
      const hashedPassword = await bcrypt.hash(_password, 10);
  
      const { rows } = await pool.query(
        'INSERT INTO users (email, username, _password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [ email, username, hashedPassword, role ]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;