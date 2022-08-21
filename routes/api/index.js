const express = require ("express"); 

const userRoutes = require ("./user"); 
const taskRoutes = require ("./tasks"); 

const router = express.Router (); 

router.use ("/user", userRoutes); 
router.use ("/tasks", taskRoutes); 

module.exports = router; 