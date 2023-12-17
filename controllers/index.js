const models = require('../models');
const { Op } = require('sequelize');
const { hashPassword, comparePassword } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');
const { validateEditProfile, validateRegister,
    validatePost, validateEditPost,
    validateAddComment, validateEditComment,
    validateReactionToPost} = require('../validations');
const jwt = require('jsonwebtoken');   

//model relationships
models.Post.hasMany(models.Comments, { foreignKey: 'post_id' });
models.Comments.belongsTo(models.Post, { foreignKey: 'post_id' });
models.Users.hasMany(models.Post, { foreignKey: 'user_id' });
models.Post.belongsTo(models.Users, { foreignKey: 'user_id' });
models.Users.hasMany(models.Comments, { foreignKey: 'user_id' });
models.Comments.belongsTo(models.Users, { foreignKey: 'user_id' });
models.Post.hasMany(models.Reactions, { foreignKey: 'post_id' });
models.Reactions.belongsTo(models.Post, { foreignKey: 'post_id' });
//users
const register = async (req, res) => { 

    const { surname, othernames, email, password, username } = req.body;
    try { 
        //validate the request body first before proceeding
        const validateData = validateRegister(req.body);
        if (validateData.error) {
            res.status(400)
           
            throw new Error({
                code: 400,
                message: validateData.error.details[0].message
            });
        }
       
        //check if the user already exists
        const user = await models.Users.findOne({
            where: {
                [Op.or]: [{ email_address: email }, { username }]
            }
        })
        if (user) {
          
            throw new Error({
                code: 400,
                message:'User already exists'
            });
        }
        //create the user
        const { hash, salt } = await hashPassword(password);
        const newUser = await models.Users.create({
            user_id: uuidv4(),
            surname,
            othernames,
            email_address: email,
            username,
            password_hash: hash,
            password_salt: salt
        })
        res.status(201).json({
            status: true,
            message: 'User created successfully',
        })


    } catch (err) { 
        const { code, message } = err
        res.status(code || 500).json({
            status: false,
            message: message || 'Something went wrong'
        });
    }

}

const profile = async (req, res) => { 
    const { user_id } = req.params;
    try { 
        const user = await models.Users.findOne({
            where: {
                user_id: user_id
            }
        });
        if (!user) throw new Error('User not found');

        delete user.dataValues.id
        delete user.dataValues.password_hash
        delete user.dataValues.password_salt

        res.status(200).json({
            status: true,
            message: 'User retrieved successfully',
            data: user
        })
    }catch(err) { 
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

const updateProfile = async (req, res) => { 
    const { user_id } = req.params;
    const validateData = validateEditProfile(req.body);
    
    try {
        //validate the request body first before proceeding
        if (validateData.error) {
            res.status(400)
            throw new Error(validateData.error.details[0].message);
        }
       //update the user
        await models.Users.update(req.body, {
            where: {
                user_id: user_id
            }
        });
        res.status(200).json({
            status: true,
            message: 'User updated successfully',
        })
     }
    catch (err) {
        res.json({
            status: false,
            error: err.message
        });
        
     }          

}

const allUsers = async (req, res) => {
    try {
        const users = await models.Users.findAll();
        res.status(200).json({
            status: true,
            message: 'Users retrieved successfully',
            data: users
        })
    
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
}

//posts 
const createPost = async (req, res) => {
    const { post } = req.body
    const { user_id } = req.params //this will be picked from the middelware authorzation
   
    try {
        //validate the request body first before proceeding
        const validateData = validatePost(req.body);
        if (validateData.error) throw new Error(validateData.error.details[0].message);
        //create the post
         await models.Post.create({
            post_id: uuidv4(),
            user_id,
            post
        })
        res.status(201).json({
            status: true,
            message: 'Post created successfully'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
}



 
const editPost = async (req, res) => {
    //user_id is picked from the authorization middleware
    //post_id is passed as a params 
    const { user_id, post_id } = req.params;
    const validateData = validateEditPost(req.body);
    
    try {
        //validate the request body first before proceeding
        if (validateData.error) throw new Error(validateData.error.details[0].message);   
       //update the user
        await models.Post.update(req.body, {
            where: {
                post_id: post_id,
                user_id: user_id
            }
        });
        res.status(200).json({
            status: true,
            message: 'Post updated successfully',
        })
     }
    catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
        
     } 
}

const getPosts = async (req, res) => { 
    const { user_id } = req.params
    try { 
        const allPosts = await models.Post.findAll({
            where: {
                user_id: user_id
            },
            attributes: ['post_id', 'post', 'createdAt', 'updatedAt']
        });
        [
                {
                post_id: '1',
                post: 'this is a post',
            },
            {
                post_id: '2',
                post: 'this is another post',
                }
        ]
        const FullRecord = await Promise.all(
            allPosts.map(async (post) => { 
            const comments = await models.Comments.findAll({
                where: {
                    post_id: post.dataValues.post_id
                },
                attributes: ['comment_id', 'comments', 'createdAt', 'updatedAt']
            })
            const reactions = await models.Reactions.findAll({
                where: {
                    post_id: post.dataValues.post_id
                },
                attributes: ['reaction_id', 'reaction', 'createdAt', 'updatedAt']
            })
            return { ...post.dataValues, comments, reactions }
        }))

    
        res.status(200).json({
            status: true,
            message: 'Posts retrieved successfully',
            data: `FullRecord`
        })
    }catch(err) { 
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

//comments 
const addComment = async (req, res) => {
    //user_id is gotten from authorization 
    //post_id is gottten as a params
    const { post_id, user_id } = req.params
    const { comment } = req.body
    try {
        //validate the request body first before proceeding
        const validateData = validateAddComment(req.body);
        if (validateData.error) throw new Error(validateData.error.details[0].message);
        //create the post
         await models.Comments.create({
            comment_id: uuidv4(),
            post_id,
            user_id,
            comments:comment
        })
        res.status(201).json({
            status: true,
            message: 'Comments added successfully'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }



}
const editComment = async (req, res) => {
    //user_id is picked from the authorization middleware
    //post_id is passed as a params 
    const { user_id, comment_id } = req.params;
    const { comment } = req.body
    const validateData = validateEditComment(req.body);
    
    try {
        //validate the request body first before proceeding
        if (validateData.error) throw new Error(validateData.error.details[0].message);   
       //update the user
        await models.Comments.update(req.body, {
            where: {
                comment_id: comment_id,
                user_id: user_id
            }
        });
        res.status(200).json({
            status: true,
            message: 'Comment updated successfully',
        })
     }
    catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
        
     } 
}
const deleteComment = async(req, res) => {
   //user_id is picked from the authorization middleware
   //post_id is passed as a params 
    const { user_id, comment_id } = req.params
    
    try {

       //update the user
        await models.Comments.destroy({
            where: {
                comment_id: comment_id,
                user_id: user_id
            }
        });
        res.status(200).json({
            status: true,
            message: 'Comment deleted successfully',
        })
     }
    catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
        
     } 
}

//like
const reactionToPost = async(req, res) => {
    const { user_id, post_id } = req.params
    const { reaction } = req.body
   const validateData = validateReactionToPost(req.body);
    try {
        //like the post
        if (validateData.error) {
            res.status(400)
            throw new Error(validateData.error.details[0].message)
        }
         await models.Reactions.create({
            reaction_id: uuidv4(),
            post_id,
            user_id,
            reaction
        })
        res.status(201).json({
            status: true,
            message: 'You reacted to the Post successfully'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }

}

const login = async (req, res) => { 
    
    const { email, password } = req.body
    try { 
        if (!email || !password) {
            res.status(400)
            throw new Error('All fields are required');
        } 
        //check if the user already exists
        const user = await models.Users.findOne({
            where: {
                email_address: email
            }
        })

     
        if (user == null) {
            res.status(400)
            throw new Error('Invalid credentials');
        }
        //check if the password is correct
        const checkPasssword = await comparePassword(password, user.dataValues.password_hash)
        if (!checkPasssword) {
            res.status(400)
            throw new Error('Invalid credentials');
        }
        //generate token
        const token = jwt.sign({
            email: user.dataValues.email_address,
            _id: uuidv4()
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: true,
            message: 'User logged in successfully',
            token
        })
    } catch (err) { 
        res.json({
            status: false,
            message: err.message
        });
    }
}


module.exports = {
    register,
    profile,
    updateProfile,
    allUsers,
    createPost,
    editPost,
    addComment,
    editComment,
    deleteComment,
    reactionToPost,
    login,
    getPosts
}