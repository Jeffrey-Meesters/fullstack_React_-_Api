'use strict';

const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult } = require('express-validator/check');
const User = require("./models").User;
const Course = require("./models").Course;
const authenticateUser = require("./auth").authenticateUser;
const jwt = require("./jwt");

const readToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    // If token does exist continue, else token wasn't send
    if (token) {
        const tokenInfo = jwt.decode(token);
        // if tokenInfo then token was succesfully decoded
        // if not the token has probably been modified
        // Use the decoded data to verify the token
        if (tokenInfo) {
            const tokenOptions = {
                issuer: tokenInfo.iss,
                subject: tokenInfo.sub,
                audience: tokenInfo.aud
            }
            // token verification
            const verified = jwt.verifyToken(token, tokenOptions);
            // added a double check to see if the data is indeed correct
            // I have the user ID as well so could also try and fetch the user
            // to check data against our DB
            // But for this course this seems fine for now
            if (verified && verified.name === verified.sub) {
                req.tokenIsGood = verified;
                next()
            } else {
                res.status(403).json({message: 'Access denied'});
            }

        } else {
            res.status(403).json({message: 'Access denied'});
            // token is invalid flag user as not auth
        }
    } else {
        res.status(403).json({message: 'Could not get Auth token'});
    }
}

// This is a router param
// Created to easely retrieve courses by ID
router.param("id", (req, res, next, id) => {
    Course.findById(id, (err, doc) => {
        if(err) {
            return next(err);
        }

        if(!doc) {
            err = new Error("Not found");
            err.status = 404;
            return next(err);
        }

        // set the found course on the request object
        req.course = doc;
        return next();
    })
})

router.get('/tokenAuth', readToken, (req, res, next) => {
    if (req.tokenIsGood) {
        res.status(200).json({data: req.tokenIsGood})
    } else {
        // just to be sure, the readToken should've done this already
        res.status(403).json({message: 'Could not get Auth token'});
    }
})

// GET /users
// Route for getting current user
// authenticateUser: user should be authenticated before this middleware executes
router.get('/users', authenticateUser, (req, res, next) => {

    // because when the user is authenticated req.currentUser will exist
    // the status is 200 and return the current user
    if (req.currentUser) {
        req.currentUser.password = 'secret ;)'
        const respData = {
            currentUser: req.currentUser,
            jwtToken: req.jwtToken
        }
        res.status(200).json(respData);

    } else {

        // When this happens authentication succeeded, but something went wrong when setting
        // the currentUser on the req object
        console.warn('Auth was succesfull, but User is not found on the request object');
        res.status(404).json({message: 'User not found'});

    }
});

// GET /users
// Route for getting current user/owner
// authenticateUser: user should be authenticated before this middleware executes
router.get('/owner/:ownerId', (req, res, next) => {
    User.findById(req.params.ownerId, (error, owner) => {
        if (error) {
            console.warn('error in DB search', error);
            res.status(401).json({message: 'Owner not found'})
        }

        if (owner) {
            res.status(200).json(owner)
        }
    })
});

// POST /users
// Route for creating users
// Validate if all required input exists
router.post('/users', [
    check('firstName').exists().withMessage('Please provide a firstName'),
    check('lastName').exists().withMessage('Please provide a lastName'),
    check('emailAddress').exists().withMessage('Please provide a emailAddress'),
    check('password').exists().withMessage('Please provide a password'),
],
(req, res, next) => {
    const errors = validationResult(req);

    // If there are errors send the error messages to the user
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json(errorMessages);

    } else if (!req.body.firstName || !req.body.lastName || !req.body.emailAddress || !req.body.password) {
        const error = new Error('Please provide: firstname, lastname, email address and password');
        error.status = 400;
        next(error);
    } else {
        // The user data is on the body of the request object
        const data = req.body;
        // use bcryt to hash the user password
        bcrypt.hash(data.password, saltRounds, function(error, hash) {
            // if no errors overwrite the password with the hash
            // and store the user data in the DB
            if (!error) {
                data.password = hash;
                const user = new User(data);
                user.save((err, user) => {
                    if(err) {
                        return next(err);
                    }

                    res.status(201).json(user);
                })
            } else {
                res.status(500).json(error);
            }
        })
    }
});

// GET /courses
// Route for getting a list of courses
router.get('/courses', (req, res, next) => {
    // find and respons with all ccourses
    Course.find({})
            .sort({createdAt: -1})
            .exec((err, courses) => {
                if(err) {
                    return next(err);
                }

                res.status(200).json(courses);
            });
});

// GET /courses/:id
// Route for getting a specific course
router.get('/courses/:id', (req, res, next) => {
    // find and respond with a specific course
    // this course is set on the request body bt the param middleware
    if (req.course) {
        res.status(200).json(req.course);
    } else {
        const error = new Error('Course not found');
        error.status = 404;
        next(error);
    }
});

// POST /courses
// Route for creating a course
// Validate if all required input exists
// Authenticate user
router.post('/courses', [
    check('user').exists().withMessage('To who is this course connected?'),
    check('title').exists().withMessage('Please provide a title'),
    check('description').exists().withMessage('Please provide a description')
],
readToken,
(req, res, next) => {
    if (req.tokenIsGood) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            res.json(errorMessages);
        } else if (!req.body.user || !req.body.title || !req.body.description ) {
            const error = new Error('Please provide: user, title and description');
            error.status = 400;
            next(error);
        } else {
            const course = new Course(req.body);
            if (course) {
                course.save((err, course) => {
                    if(err) {
                        return next(err);
                    }

                    res.location(`/api/courses/${course._id}`);
                    res.sendStatus(201);
                })
            } else {
                const error = new Error('Course information not found');
                next(error);
            }
        }
    }
});

// PUT /courses/:id
// Route for updating a specific course
router.put('/courses/:id', [
    check('user').exists().withMessage('Tho who is this course connected?'),
    check('title').exists().withMessage('Please provide a title'),
    check('description').exists().withMessage('Please provide a description')
],
readToken,
(req, res, next) => {
    if (req.tokenIsGood) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            res.json(errorMessages);
        } else if (!req.course.user || !req.course.title || !req.course.description) {
            const error = new Error('Please provide: user, title and description');
            error.status = 400;
            return next(error);
        }

        // Object destructuring to get the currentUser from the req object
        // Got a linter warning on this at work and find it awesome :p

        const ownerIds = req.course.user;

        // A user may only update a course if he/she is the owner
        // So loop over owner ids
        // check if the currentUser is the owner
        // If so update else forbid the user

        // The id is inside an array
        // instead of using [0] I decided to use a foreach loop
        // when more users are associated with a course
        ownerIds.forEach(id => {
            User.findById(id, (error, user) => {
                if (error) {
                    return next(error)
                }

                if (user) {
                    // emailAddresses should be unique
                    // So when the currentUser emailaddress does not match with the courses owner
                    // email adddress te currentUser may not update it
                    if (req.tokenIsGood.name !== user.emailAddress) {
                        const error = new Error('You\'re not allowed to change this course.');
                        error.status = 403;
                        return next(error)

                    } else {
                        req.course.update(req.body, (err, data) => {
                            if(err) {
                                return next(err);
                            }

                            res.sendStatus(201)
                        });

                    }
                } else {
                    res.status(403).json({message: 'User not found'})
                }
            })
        });
    }
});

// DELETE /courses/:id
//  Route for deleting a specific course
router.delete('/courses/:id', readToken, (req, res, next) => {
    // If token does exist continue, else token wasn't send
    if (req.tokenIsGood) {
        const ownerIds = req.course.user;

        // A user may only delete a course if he/she is the owner
        // So loop over owner ids
        // check if the currentUser is the owner
        // If so delete else forbid the user
        ownerIds.forEach(id => {
            // find a user by id
            User.findById(id, (error, user) => {
                if (error) {
                    return next(error)
                }

                if (user) {
                    // emailAddresses should be unique
                    // So when the currentUser emailaddress does not match with the courses owner
                    // email adddress te currentUser may not delete it
                    if (req.tokenIsGood.name !== user.emailAddress) {

                        res.sendStatus(403)

                    } else {

                        // remove the course from the DB
                        req.course.remove((err) => {
                            if(err) {
                                return next(err);
                            }

                            res.sendStatus(204);
                        })

                    }
                } else {
                    res.status(403).json({message: 'User not found'})
                }
            })
        });
    }
});

module.exports = router;
