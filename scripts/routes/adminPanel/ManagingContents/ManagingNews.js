const express = require('express');
const session = require('express-session');
const isAdminMiddleware = require('../../../middlewares/isAdminMiddleware');
const { pool } = require('../../../database/dbSetup');
const router = express.Router();

//Getting all news
router.get('/admin/news', isAdminMiddleware, async (req, res) => {
    try
    {
      const result = await pool.query('SELECT * FROM news');
  
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Removing news
  router.delete('/admin/remove-news', isAdminMiddleware, async (req, res) => {
    try
    {
      const { newsId } = req.body;
        
      await pool.query('DELETE FROM news WHERE id = $1', [newsId]);
  
      res.json({ message: "News was deleted" });
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Altering news
  router.patch('/admin/modify-news', isAdminMiddleware, async (req, res) => {
    try
    {
      const { title, content, newsId } = req.body;
  
      const { rows } = await pool.query(
        'UPDATE news SET title = $1, content = $2 WHERE id = $3 RETURNING *',
        [ title, content, newsId ]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Adding news
  router.post('/admin/add-news', isAdminMiddleware, async (req, res) => {
    try
    {
      const { title, content } = req.body;
      const authorId = req.session.user.id;
  
      const { rows } = await pool.query(
        'INSERT INTO news (title, content, authorId) VALUES ($1, $2, $3) RETURNING *',
        [ title, content, authorId]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;