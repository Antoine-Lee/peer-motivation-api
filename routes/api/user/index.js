const express = require ("express"); 
const userController = require ("../../../controllers/user"); 

const router = express.Router (); 

router.post ("/register", userController.register); 
router.post ("/login", userController.login); 
router.get ("/getUser", userController.checkUser, userController.getUser); 
router.put ("/request/:friendUsername", userController.checkUser, userController.requestFriend); 
router.put ("/approve/:friendId", userController.checkUser, userController.approveFriend); 
router.put ("/disapprove/:friendId", userController.checkUser, userController.disapproveFriend); 

module.exports = router; 