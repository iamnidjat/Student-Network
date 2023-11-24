const express = require('express');
const session = require('express-session');
const isUserMiddleware = require('../middlewares/isUserMiddleware');
const isAdminOrTeacherMiddleware = require('../middlewares/isAdminOrTeacherMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();

//Posting news
router.post('/add-news', isAdminOrTeacherMiddleware, async (req, res) => {
  try 
  {
    const { title, content } = req.body;
    const authorId = req.session.user.id;

    await pool.query('INSERT INTO news (title, content, authorId) VALUES ($1, $2, $3)', 
    [title, content, authorId]);

    res.status(201).send('News was added successfully!');
  } 
  catch (error) 
  {
    res.status(500).json({ error: error.message });
  }
});

//Getting all news
router.get('/get-news', isUserMiddleware, async (req, res) => {
  try 
  {
    const result = await pool.query('SELECT * FROM news ORDER BY createdAt DESC');

    res.json(result.rows);
  } 
  catch (error) 
  {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;