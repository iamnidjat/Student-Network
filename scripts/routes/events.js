const express = require('express');
const session = require('express-session');
const isUserMiddleware = require('../middlewares/isUserMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();

// Adding an event
router.post('/add-event', isUserMiddleware, async (req, res) => {
    try 
    {
      const { title, description, startDate, endDate } = req.body;
      const creatorId = req.session.user.id;
    
      const result = await pool.query('INSERT INTO events (title, description, startDate, endDate, creatorId) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [title, description, startDate, endDate, creatorId]);
    
      res.status(201).send('Event was added successfully.');
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Adding participants
  router.post('/add-participants', isUserMiddleware, async (req, res) => {
    try 
    {
      const { eventId, userId } = req.body;
  
      await pool.query('INSERT INTO eventParticipants (eventId, userId) VALUES ($1, $2)', 
      [eventId, userId]);
      
      res.status(201).send('Participants were added successfully.');
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Getting an event for a particular student
  router.get('/get-event', isUserMiddleware, async (req, res) => {
    try 
    {
      const userId = req.session.user.id;
      const result = await pool.query('SELECT * FROM events WHERE creatorId = $1 ORDER BY startDate', 
      [userId]);
  
      res.json(result.rows);
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;