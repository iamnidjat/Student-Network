const express = require('express');
const session = require('express-session');
const isAdminMiddleware = require('../../../middlewares/isAdminMiddleware');
const { pool } = require('../../../database/dbSetup');
const router = express.Router();

//Getting opportunities
router.get('/admin/opportunities', isAdminMiddleware, async (req, res) => {
    try
    {
      const result = await pool.query('SELECT * FROM opportunities');
  
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Removing opportunities
  router.delete('/admin/remove-opportunity', isAdminMiddleware, async (req, res) => {
    try
    {
      const { opportunityId } = req.body;
        
      await pool.query('DELETE FROM opportunities WHERE id = $1', [opportunityId]);
  
      res.json({ message: "Opportunity was deleted" });
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Altering opportunities
  router.patch('/admin/modify-opportunity', isAdminMiddleware, async (req, res) => {
    try
    {
      const { title, description, typeOfOpportunity, deadline, opportunityId } = req.body;
  
      const { rows } = await pool.query(
        'UPDATE opportunities SET title = $1, description = $2, typeOfOpportunity = $3, ' 
        + 'deadline = $4 WHERE id = $5 RETURNING *',
        [ title, description, typeOfOpportunity, deadline, opportunityId ]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Adding opportunities
  router.post('/admin/add-opportunity', isAdminMiddleware, async (req, res) => {
    try
    {
      const { title, description, typeOfOpportunity, deadline } = req.body;
  
      const { rows } = await pool.query(
        'INSERT INTO opportunities (title, description, typeOfOpportunity, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
        [ title, description, typeOfOpportunity, deadline ]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;