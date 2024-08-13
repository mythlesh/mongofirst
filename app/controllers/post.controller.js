var Post = require('../models/post.model.js');
var User = require('../models/user_model.js');
const jwt = require('jsonwebtoken');


exports.create = async function (req, res) {
    try {
        // Check if email and password are provided
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({
                success: false,
                message: "Authorization header missing or malformed!"
            });
        }

        // Get the token from the Authorization header
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secretkey', async function (err, decoded) {

            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid Token!"
                });
            }

            // if (req.body.email != decoded.email) {
            //     return res.status(400).send({ message: "Please provide correct email" });
            // }
            if (!req.body.title || !req.body.subtitle) {
                return res.status(400).send({ message: "Please provide all details" });
            }

            let user = await User.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found!"
                });
            } else {
                var post = await Post.create({
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    postedBy: user._id,
                    likesCount: 0,
                    likedBy: []
                });
                if (!post) {
                    return res.status(404).send({
                        success: false,
                        message: "Unable to create Post!"
                    });
                }
                res.send({
                    success: true,
                    post: post,
                    userDetails: user,
                    message: "Post Created successfully!"
                });
            }
        })
    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send error response
        res.status(500).send({
            success: false,
            message: "An error occurred while Changing Password.",
            error: error.message
        });
    }
};

exports.getPosts = async function (req, res) {
    try {
        // Check if email and password are provided
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({
                success: false,
                message: "Authorization header missing or malformed!"
            });
        }

        // Get the token from the Authorization header
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secretkey', async function (err, decoded) {

            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid Token!"
                });
            }
            const posts = await Post.find();

            if (!posts) {
                return res.status(404).send({
                    success: false,
                    message: "Posts not found!"
                });
            }

            // Fetch users for each post
            const allPosts = await Promise.all(posts.map(async (post) => {
                const user = await User.findOne({ _id: post.postedBy });
                if (!user) {
                    return res.status(404).send({
                        success: false,
                        message: "User not found!"
                    });
                }
                let isLiked = false;
                if (post.likedBy.includes(decoded.email)) {
                    isLiked = true;
                }

                return {
                    post: {
                        ...post.toObject(),  // Convert the Mongoose document to a plain object
                        isLiked: isLiked,  // Exclude the 'likedBy' field
                        likedBy: undefined
                    },
                    postedBy: user
                };
            }));

            // Send success response with all posts
            res.send({
                success: true,
                posts: allPosts,
                message: "Fetched Posts successfully!"
            });
        })
    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send error response
        res.status(500).send({
            success: false,
            message: "An error occurred while Changing Password.",
            error: error.message
        });
    }

};

exports.likePost = async function (req, res) {
    try {
        // Check if email and password are provided
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({
                success: false,
                message: "Authorization header missing or malformed!"
            });
        }

        // Get the token from the Authorization header
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secretkey', async function (err, decoded) {

            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid Token!"
                });
            }
            const post = await Post.findOne({ _id: req.params.postId });

            if (!post) {
                return res.status(404).send({
                    success: false,
                    message: "Post not found!"
                });
            }


            if (post.likedBy.includes(decoded.email)) {
                post.likesCount = post.likesCount - 1; post.likedBy = post.likedBy.filter(x => x != decoded.email);
            } else {
                post.likesCount = post.likesCount + 1; post.likedBy.push(decoded.email);
            }

            await post.save();
            res.send({
                success: true,
                post: {
                    ...post.toObject(),  // Convert the Mongoose document to a plain object
                    likedBy: undefined  // Exclude the 'likedBy' field
                },
                message: post.likedBy.includes(decoded.email) ? "Post Liked successfully!" : "Post Disliked successfully!"
            });
        })


    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send error response
        res.status(500).send({
            success: false,
            message: "An error occurred while Changing Password.",
            error: error.message
        });
    }

};

exports.deletePost = async function (req, res) {
    try {
        // Check if email and password are provided
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({
                success: false,
                message: "Authorization header missing or malformed!"
            });
        }

        // Get the token from the Authorization header
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secretkey', async function (err, decoded) {

            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid Token!"
                });
            }
            const post = await Post.findOneAndDelete({ _id: req.params.postId });

            if (!post) {
                return res.status(404).send({
                    success: false,
                    message: "Post not found!"
                });
            }
            res.send({
                success: true,
                post: {
                    ...post.toObject(),  // Convert the Mongoose document to a plain object
                    likedBy: undefined  // Exclude the 'likedBy' field
                },
                message: "Post Deleted successfully!"
            });
        })


    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send error response
        res.status(500).send({
            success: false,
            message: "An error occurred while Changing Password.",
            error: error.message
        });
    }

};