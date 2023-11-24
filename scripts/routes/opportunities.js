const express = require('express');
const session = require('express-session');
const isUserMiddleware = require('../middlewares/isUserMiddleware');
const isAdminOrTeacherMiddleware = require('../middlewares/isAdminOrTeacherMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();

//Posting an opportunity
router.post('/add-opportunity', isAdminOrTeacherMiddleware, async (req, res) => {
    try 
    {
      const { title, description, typeOfOpportunity, deadline } = req.body;
  
      await pool.query('INSERT INTO opportunities (title, description, typeOfOpportunity, deadline) VALUES ($1, $2, $3, $4)', 
      [title, description, typeOfOpportunity, deadline]);
  
      res.status(201).send('Opportunity was added successfully!');
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Getting all opportunities
  router.get('/get-opportunities', isUserMiddleware, async (req, res) => {
    try 
    {
      const result = await pool.query('SELECT * FROM opportunities ORDER BY createdAt DESC');
  
      res.json(result.rows);
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
