const express = require('express');
const session = require('express-session');
const isStudentMiddleware = require('../middlewares/isStudentMiddleware');
const isAdminOrTeacherMiddleware = require('../middlewares/isAdminOrTeacherMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();

//Adding an achievment for a particular student
router.post('/add-achievment', isAdminOrTeacherMiddleware, async (req, res) => {
    try 
    {
      const { studentId, badgeName, description } = req.body;
      
      await pool.query('INSERT INTO achievments (studentId, badgeName, description) VALUES ($1, $2, $3)', 
      [studentId, badgeName, description]);
    
      res.status(201).send('Achievment was added successfully!');
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Getting an achievment for a particular student
  router.get('/achievments', isStudentMiddleware, async (req, res) => {
    try
    {
      const studentId = req.session.user.id;
  
      const result = await pool.query('SELECT * FROM achievments WHERE studentId = $1 ORDER BY createdAt DESC', 
      [studentId]);
  
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;