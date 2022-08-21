const taskModel = require ("../models/task"); 

const newTask = async (req, res) => 
{
    try 
    {
        const { title, description, dueDate, consequence, helper } = req.body; 
        const { _id: owner } = req.user; 

        if (!title || !description || !dueDate || !consequence || !helper)
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "Title, description, due date, consequence and helper are required"
            })
        }

        const newTask = await taskModel.create ({
            title, description, dueDate, consequence, owner, helper
        })

        res.status (200).json ({
            status: "SUCCESS", 
            message: "Task was created successfully", 
            newTask
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

const getTask = async (req, res) => 
{
    // try
    // {
    //     const { userId } = req.session; 
        
    //     if (!userId)
    //     {
    //         return res.status (400).json ({
    //             status: "ERROR", 
    //             message: "User not logged in"
    //         })
    //     }

    //     const existingUser = await userModel.findById (userId); 

    //     if (!existingUser)
    //     {
    //         return res.status (400).json ({
    //             status: "ERROR", 
    //             message: "User not valid"
    //         })
    //     }

    //     res.status (200).json ({
    //         status: "SUCCESS", 
    //         message: {
    //             ...existingUser._doc, 
    //             password: undefined
    //         }
    //     })
    // }
    // catch (error)
    // {
    //     console.error (error); 

    //     res.status (500).json ({
    //         status: "ERROR", 
    //         message: "Server error"

    //     })
    // }
}

module.exports = { newTask, getTask }