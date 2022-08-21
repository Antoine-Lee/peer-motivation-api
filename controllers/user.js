const { request } = require("express");
const userModel = require ("../models/user"); 

const register = async (req, res) => 
{
    try 
    {
        const { email, username, password } = req.body; 

        if (!email || !username || !password)
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "Email, username and password are required"
            })
        }

        const existingEmail = await userModel.findOne ({ email })

        if (existingEmail)
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "Email already registered"
            })
        }

        const existingUsername = await userModel.findOne ({ username })

        if (existingUsername)
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "Username already exists"
            })
        }

        const newUser = await userModel.create ({
            email, username, password
        })

        req.session.userId = newUser._id; 

        res.status (200).json ({
            status: "SUCCESS", 
            message: "User was created successfully"
        })
    }
    catch (error)
    {
        console.error (error); 

        res.status (500).json ({
            status: "ERROR", 
            message: "Server error"
        })
    }
}

const login = async (req, res) => 
{
    try 
    {
        const { username, password } = req.body; 

        if (!username || !password)
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "Username and password are required"
            })
        }

        const existingUser = await userModel.findOne ({
            username: username
        })

        if (!existingUser || existingUser.password != password)
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "Username or password incorrect"
            })
        }

        req.session.userId = existingUser._id; 

        res.status (200).json ({
            status: "SUCCESS", 
            message: "User was logged in successfully"
        })
    }
    catch (error)
    {
        console.error (error); 

        res.status (500).json ({
            status: "ERROR", 
            message: "Server error"

        })
    }
}

const checkUser = async (req, res, next) => 
{
    const { userId } = req.session; 
        
    if (!userId)
    {
        return res.status (400).json ({
            status: "ERROR", 
            message: "User not logged in"
        })
    }

    const existingUser = await userModel.findById (userId); 

    if (!existingUser)
    {
        return res.status (400).json ({
            status: "ERROR", 
            message: "User not valid"
        })
    }

    req.user = existingUser; 

    next(); 
}

const getUser = async (req, res) => 
{
    try
    {
        await req.user.populate ('friends.friend'); 

        res.status (200).json ({
            status: "SUCCESS", 
            message: {
                ...req.user._doc, 
                password: undefined
            }
        })
    }
    catch (error)
    {
        console.error (error); 

        res.status (500).json ({
            status: "ERROR", 
            message: "Server error"

        })
    }
}

const requestFriend = async (req, res) => 
{
    try
    {
        const { userId } = req.session; 
            
        // if (!userId)
        // {
        //     return res.status (400).json ({
        //         status: "ERROR", 
        //         message: "User not logged in"
        //     })
        // }

        const { friendUsername } = req.params; 
        
        // const requestor = await userModel.findById (userId); 
        const requestor = req.user; 
        await requestor.populate ('friends.friend'); 
        if(requestor.friends.some(({ friend }) => friend.username === friendUsername)) // already a friend
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "User already in friends list"
            })
        }

        const requestee = await userModel.findOne ({ username: friendUsername })

        const newFriendReq = {
            friend: requestee._id,
            isRequestor: true,
            isApproved: false
        }
        requestor.friends.push (newFriendReq); 
        await requestor.save (); 

        // const requestee = await userModel.findById (friendId); 
        
        requestee.friends.push ({
            friend: userId,
            isRequestor: false,
            isApproved: false
        })
        await requestee.save (); 

        res.status (200).json ({
            status: "SUCCESS", 
            message: "Friend request sent successfully", 
            request: newFriendReq
        })
    }
    catch (error)
    {
        console.error (error); 

        res.status (500).json ({
            status: "ERROR", 
            message: "Server error"
        })
    }
}

const approveFriend = async (req, res) => 
{
    try
    {
        const { userId } = req.session; 

        const requestee = req.user; 
        // const requestee = await userModel.findById (userId); 
            
        // if (!requestee) 
        // {
        //     return res.status (400).json ({
        //         status: "ERROR", 
        //         message: "User not logged in"
        //     })
        // }

        const { friendId } = req.params; 

        const requestor = await userModel.findById (friendId); 
        requestor.friends.find ((friend) => friend.friend.toString() === userId).isApproved = true; 
        await requestor.save (); 
        
        const requesteeFriend = requestee.friends.find ((friend) => friend.friend.toString() === friendId); 
        requesteeFriend.isApproved = true; 
        await requestee.save (); 

        res.status (200).json ({
            status: "SUCCESS", 
            message: "Friend request approved successfully", 
            request: requesteeFriend
        })
    }
    catch (error)
    {
        console.error (error); 

        res.status (500).json ({
            status: "ERROR", 
            message: "Server error"
        })
    }
}

const disapproveFriend = async (req, res) => 
{
    try
    {
        const { userId } = req.session; 

        // const requestee = await userModel.findById (userId); 
        const requestee = req.user; 
            
        // if (!requestee) 
        // {
        //     return res.status (400).json ({
        //         status: "ERROR", 
        //         message: "User not logged in"
        //     })
        // }

        const { friendId } = req.params; 

        const requestor = await userModel.findById (friendId); 
        const requestorIndex = requestor.friends.findIndex ((friend) => friend.friend.toString() === userId); 
        console.log (requestorIndex); 
        requestor.friends.splice(requestorIndex); 
        await requestor.save (); 
        
        const requesteeIndex = requestee.friends.findIndex ((friend) => friend.friend.toString() === friendId); 
        console.log (requesteeIndex); 
        requestee.friends.splice (requesteeIndex); 
        await requestee.save (); 

        res.status (200).json ({
            status: "SUCCESS", 
            message: "Friend request approved successfully"
            // request: requesteeFriend
        })
    }
    catch (error)
    {
        console.error (error); 

        res.status (500).json ({
            status: "ERROR", 
            message: "Server error"
        })
    }
}

module.exports = { register, login, checkUser, getUser, requestFriend, approveFriend, disapproveFriend }