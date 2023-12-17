const express = require("express");
const router = express.Router();
const {
        register, profile, updateProfile,
        allUsers, createPost, editPost,
        addComment, editComment, deleteComment,
        reactionToPost, login, getPosts
} = require("../controllers");
const {authorization} = require('../middlewares/authorization')

/**
 * register a new customer
 * @swagger
 * /api/v1/create:
 *   post:
 *     summary: creates a new account
 *     description: This Creates a new record for the customer
 *     tags:
 *       - Account
 *     produces:	 
 *       - application/json	 
 *     parameters:	 
 *       - name: surname	 
 *         in: body	 
 *         required: true
 *       - name: othernames	 
 *         in: body	 
 *         required: true
 *       - name: email_address	 
 *         in: body	 
 *         required: true
 *       - name: phone_number	 
 *         in: body	 
 *         required: true
 *       - name: password	 
 *         in: body	 
 *         required: true  
 *     responses:
 *        201:
 *          description: Account created.
 *        422:
 *          Bad Request
*/
//login
router.post("/login", login);

//users routes
router.post("/register", register);

router.get("/profile", authorization, profile);
router.patch("/profile", authorization, updateProfile);

//posts routes
router.post("/post", authorization, createPost);
router.patch("/post/:post_id", authorization, editPost)
router.get("/posts", authorization, getPosts);

//comments routes
router.post("/comment/:post_id", authorization, addComment);
router.patch("/comment/:comment_id", authorization, editComment)
router.delete("/comment/:comment_id", authorization, deleteComment)

//reaction routes
router.post("/post/reaction/:post_id", authorization, reactionToPost);

//follow routes

//admin routes
router.get("/admin/users", authorization, allUsers);

module.exports = router;