const express = require ("express"); 
const taskController = require ("../../../controllers/task"); 
const userController = require ("../../../controllers/user"); 

const router = express.Router (); 

router.post ("/newTask", userController.checkUser, taskController.newTask); 
router.get ("/getTask", taskController.getTask); 

module.exports = router; 