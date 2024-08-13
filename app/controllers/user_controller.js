var User = require('../models/user_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.create = async function (req, res) {
    try {
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.phone) {
            return res.status(400).send({ message: "Please Provide all details" });
        }

        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).send({
                success: false,
                message: "User with above email already exists!"
            });
        }



        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
                let token = jwt.sign({ email: req.body.email }, 'secretkey');
                console.log(token);
                let { name, email, phone } = req.body;
                var user = await User.create({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hash,
                    token: token
                });
                if (!user) {
                    return res.status(404).send({
                        success: false,
                        message: "Unable to create User!"
                    });
                }
                res.send({
                    success: true,
                    user: user,
                    message: "User Created successfully!"
                });

            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while Created the User.",
            error: error.message
        });
    }

};
exports.login = async function (req, res) {
    try {
        // Check if email and password are provided
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ message: "Please provide all details" });
        }

        // Find the user based on email and password
        const user = await User.findOne({ email: req.body.email });

        // Check if user was found
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "No User found with this email"
            });
        }

        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result == true) {
                // Send success response
                res.send({
                    success: true,
                    user: user,
                    message: "User logged in successfully!"
                });
            } else {
                // Send error response
                res.status(404).send({
                    success: false,
                    message: "Password incorrect!"
                });
            }
        });
    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send error response
        res.status(500).send({
            success: false,
            message: "An error occurred while logging in.",
            error: error.message
        });
    }
};
exports.changePassword = async function (req, res) {
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

            if (req.body.email != decoded.email) {
                return res.status(400).send({ message: "Please provide correct email" });
            }
            if (!req.body.email || !req.body.password) {
                return res.status(400).send({ message: "Please provide all details" });
            }
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const user = await User.findOneAndUpdate({ email: req.body.email }, { email: req.body.email, password: hash }, { new: true });
                    // Check if user was found
                    if (!user) {
                        return res.status(404).send({
                            success: false,
                            message: "User with above email not found!"
                        });
                    }
                    // Send success response
                    res.send({
                        success: true,
                        user: user,
                        message: "Password changed successfully!"
                    });

                });
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
}
exports.getUser = async function (req, res) {
    try {

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

            // Find the user based on email and password
            const user = await User.findOne({ email: decoded.email });

            // Check if user was found
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User with above id not found!"
                });
            }

            // Send success response
            res.send({
                success: true,
                user: user,
                message: "Document Fetched successfully!"
            });
            // Find the user based on email and password
        })


    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send error response
        res.status(500).send({
            success: false,
            message: "An error occurred while Getting User.",
            error: error.message
        });
    }
}