const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const isUserMiddleware = require('../middlewares/isUserMiddleware');
const isNotUserMiddleware = require('../middlewares/isNotUserMiddleware');
const { pool } = require('../database/dbSetup');
const router = express.Router();


//Register
router.post('/register', isNotUserMiddleware, async (req, res) => {
    try
    {
      const { username, email, _password, role } = req.body;
      const hashedPassword = await bcrypt.hash(_password, 10);
  
      await pool.query(
        'INSERT INTO users (username, email, _password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, hashedPassword, role], (error, results) => {
          if (error) {
            throw error;
          }
  
          const user = results.rows[0];
  
          console.log(user);
          
          req.session.user = user;
  
          console.log('Congratulations! You succesfully registered!\nYou\'ll be redirected to the profile dashboard');
          res.redirect('/profileD/profile-dashboard');
        }
      );
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Login
  router.post('/login', isNotUserMiddleware, async (req, res) => {
    try
    {
      const { username, _password } = req.body;
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
      const user = result.rows[0];
      console.log(user);
    
      if (user) {
        const passwordMatch = await bcrypt.compare(_password, user._password);
    
        if (passwordMatch) {
          req.session.user = user;
    
          console.log('Congratulations! You succesfully logged in!\nYou\'ll be redirected to the profile dashboard');
          res.redirect('/profileD/profile-dashboard');
        } 
        else {
          res.send('Incorrect password');
        }
      } 
      else {
        res.send('User is not found');
      }
    } 
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Logout  
  router.get('/logout', isUserMiddleware,(req, res) => {
    try
    {
      req.session.destroy();
      console.log("You were logged out!");
      return res.status(403).send("You were logged out!");
      //res.redirect('/auth/login');
    }
    catch (error) 
    {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
