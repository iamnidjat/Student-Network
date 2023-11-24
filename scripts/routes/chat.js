const express = require('express');
const session = require('express-session');
//const http = require('http');
//const socketIo = require('socket.io');
const isUserMiddleware = require('../middlewares/isUserMiddleware');
const router = express.Router();
const { pool } = require('../database/dbSetup');
// const server = http.createServer(app);
// const io = socketIo(server);

//Sending private messages
router.post('/private-messages', isUserMiddleware, async (req, res) => {
    try
    {
      const { senderId, receiverId, content } = req.body;
  
      await pool.query('INSERT INTO privateMessages (senderId, receiverId, content) VALUES ($1, $2, $3)', 
      [senderId, receiverId, content]);
  
      res.json({ success: true });
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Getting private messages
  router.get('/private-messages/:senderId/:receiverId', isUserMiddleware, async (req, res) => {
    try
    {
      const { senderId, receiverId } = req.params;
  
      const result = await pool.query('SELECT * FROM privateMessages WHERE (senderId = $1 AND receiverId = $2) OR (senderId = $2 AND receiverId = $1) ORDER BY time', 
      [senderId, receiverId]);
    
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Sending group messages
  router.post('/group-messages', isUserMiddleware, async (req, res) => {
    try
    {
      const { senderId, groupId, content } = req.body;
  
      await pool.query('INSERT INTO groupMessages (senderId, groupId, content) VALUES ($1, $2, $3)', 
      [senderId, groupId, content]);
  
      res.json({ success: true });
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Getting group messages
  router.get('/group-messages/:groupId', isUserMiddleware, async (req, res) => {
    try
    {
      const { groupId } = req.params;
  
      const result = await pool.query('SELECT * FROM groupMessages WHERE groupId = $1 ORDER BY time', 
      [groupId]);
    
      res.json(result.rows);
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  // io.on('connection', (socket) => {
  //   console.log('A user connected');
  
  //   socket.on('disconnect', () => {
  //     console.log('User disconnected');
  //   });
  
  //   socket.on('group-messages', isUserMiddleware, async (data) => {
  //     try
  //     {
  //       const { senderId, groupId, content } = data;
    
  //       const result = await pool.query('INSERT INTO groupMessages (senderId, groupId, content) VALUES ($1, $2, $3)', 
  //       [senderId, groupId, content]);
  
  //       const insertedMessage = result.rows[0];
  //       io.emit('groupMessage', insertedMessage);
  //     }
  //     catch (error) 
  //     {
  //       console.error(error);
  //     }
  //   });
  
  //   socket.on('private-messages', isUserMiddleware, async (data) => {
  //     try
  //     {
  //       const { senderId, receiverId, content } = data;
    
  //       const result = await pool.query('INSERT INTO privateMessages (senderId, receiverId, content) VALUES ($1, $2, $3)', 
  //       [senderId, receiverId, content]);
  
  //       const insertedMessage = result.rows[0];
  //       io.emit('privateMessage', insertedMessage);
  //     }
  //     catch (error) 
  //     {
  //       console.error(error);
  //     }
  //   });
  // });

  module.exports = router;