const express = require('express');
const session = require('express-session');
const isStudentMiddleware = require('../middlewares/isStudentMiddleware');
const isTeacherMiddleware = require('../middlewares/isTeacherMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();

//Add a hw
router.post('/add-hw', isTeacherMiddleware,async (req, res) => {
    try 
    {
      const { description, groupId, deadline } = req.body;
      const teacherId = req.session.user.id;

      const group = await pool.query(
        'SELECT * FROM _groups WHERE id = $1', [groupId]
      );

      if (group.rows[0] !== undefined)
      {

        const { rows } = await pool.query(
          'INSERT INTO tasks (description, groupId, teacherId, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
          [description, groupId, teacherId, deadline]
        );
    
        console.log("You added a task!");
        res.status(201).json(rows[0]);
      }
      else {
        console.log("There is no group with that id!");
        return res.status(403).send("There is no group with that id!");
      }
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Get a hw for a particular group
  router.get('/get-hw', isStudentMiddleware, async (req, res) => {
    try 
    {
      const { groupNumber} = req.body;
  
      const { rows } = await pool.query(
        'SELECT * FROM tasks WHERE groupNumber = $1',
        [groupNumber]
      );
  
      console.log(`Here are all tasks for the group ${groupNumber}:\n`);
      res.status(201).json(rows[0]);
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Upload a hw
  router.post('/upload-hw', isStudentMiddleware, async (req, res) => {
    try 
    {
      const { hw, groupId, uploadedDate } = req.body;
      const studentId = req.session.user.id;
  
      const { rows } = await pool.query(
        'INSERT INTO uploadedTasks (hw, studentId, groupId, uploadedDate) VALUES ($1, $2, $3) RETURNING *',
        [hw, studentId, groupId, uploadedDate]
      );
  
      console.log("You uploaded a task!");
      res.status(201).json(rows[0]);
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Give a student a grade
  router.post('/give-grade', isTeacherMiddleware, async (req, res) => {
    try 
    {
      const { studentId, taskId, grade } = req.body;
      const teacherId = req.session.user.id;

      
      const student = await pool.query(
        'SELECT * FROM users WHERE id = $1', [studentId]
      );

      const task = await pool.query(
        'SELECT * FROM tasks WHERE id = $1', [taskId]
      );
    
      if (student.rows[0] !== undefined && task.rows[0] !== undefined && grade >= 1 && grade <= 12)
      {
        const { rows } = await pool.query(
          'INSERT INTO grades (studentId, teacherId, taskId, grade) VALUES ($1, $2, $3, $4) RETURNING *',
          [studentId, teacherId, taskId, grade]
        );
    
        console.log(`You gave the student ${studentId} the ${grade} grade`);
        res.status(201).json(rows[0]);
      }
      else {
        console.log('Pay attention to studentId or taskId or the grade that you gave (it must be more than 0 and less than 13!');
        res.status(403).send('Pay attention to studentId or taskId or the grade that you gave (it must be more than 0 and less than 13!');
      }
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;