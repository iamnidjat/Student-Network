const express = require('express');
const session = require('express-session');
const isUserMiddleware = require('../middlewares/isUserMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();

//Create a group
router.post('/create-group', isUserMiddleware, async (req, res) => {
    try
    {
      const { groupName, description } = req.body;
      const createdBy = req.session.user.id;

      const group = await pool.query(
        'SELECT * FROM _groups WHERE groupName = $1', [groupName]
      );

      if (group.rows[0] === undefined)
      {
        const result = await pool.query('INSERT INTO _groups (groupName, description, createdBy) VALUES ($1, $2, $3) RETURNING id',
        [groupName, description, createdBy]);
  
        const groupId = result.rows[0].id;
    
        await pool.query('INSERT INTO groupMembers (groupId, userId) VALUES ($1, $2)', [groupId, createdBy]);
    
        res.status(201).send('Group created successfully!');
      }
      else {
        console.log(`Group with the name (${groupName}) already exists!`);
        return res.status(403).send(`Group with the name (${groupName}) already exists!`);
      }
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Join a group
  router.post('/join-group', isUserMiddleware, async (req, res) => {
    try
    {
      const { groupId } = req.body;
      const userId = req.session.user.id;
  
      await pool.query('INSERT INTO groupMembers (groupId, userId) VALUES ($1, $2)', 
      [groupId, userId]);
  
      res.status(200).send('Joined group successfully!');
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get all groups for a particular user
  router.get('/get-all-groups', isUserMiddleware, async (req, res) => {
    try
    {
      const userId = req.session.user.id;
      const result = await pool.query('SELECT * FROM _groups WHERE id IN (SELECT groupId FROM groupMembers WHERE userId = $1) ORDER BY createdAt DESC', 
      [userId]);
  
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Adding posts in a forum
  router.post('/groups/forum/post', isUserMiddleware, async (req, res) => {
    try
    {
      const { groupId, content } = req.body;
      const userId = req.session.user.id;
    
      await pool.query('INSERT INTO forums (groupId, userId, content) VALUES ($1, $2, $3)', 
      [groupId, userId, content]);
    
      res.status(201).send('Forum post was added successfully!');
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Getting posts from a group's forum
  router.get('/groups/forum/:groupId', isUserMiddleware, async (req, res) => {
    try
    {
      const { groupId } = req.params;
      const result = await pool.query('SELECT * FROM forums WHERE groupId = $1 ORDER BY createdAt DESC', 
      [groupId]);
  
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;