const express = require('express');
const session = require('express-session');
const isAdminMiddleware = require('../../middlewares/isAdminMiddleware');
const { pool } = require('../../database/dbSetup');
const router = express.Router();

//Getting all groups
router.get('/admin/groups', isAdminMiddleware, async (req, res) => {
    try
    {
      const result = await pool.query('SELECT * FROM _groups');
  
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Removing a group
  router.delete('/admin/remove-group', isAdminMiddleware, async (req, res) => {
    try
    {
      const { groupId } = req.body;
        
      await pool.query('DELETE FROM _groups WHERE id = $1', [groupId]);
  
      res.json({ message: "Group was deleted" });
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Altering a group
  router.patch('/admin/modify-group', isAdminMiddleware, async (req, res) => {
    try
    {
      const { groupName, description, groupId } = req.body;
  
      const { rows } = await pool.query(
        'UPDATE _groups SET groupName = $1, description = $2 WHERE id = $13 RETURNING *',
        [ groupName, description, groupId ]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Adding a group
  router.post('/admin/add-group', isAdminMiddleware, async (req, res) => {
    try
    {
      const { groupName, description } = req.body;
      const createdBy = req.session.user.id;
  
      const { rows } = await pool.query(
        'INSERT INTO _groups (groupName, description, createdBy) VALUES ($1, $2, $3) RETURNING *',
        [ groupName, description, createdBy]
      );
  
      res.json(rows[0]);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;