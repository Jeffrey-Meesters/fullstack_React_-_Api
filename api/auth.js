const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const User = require("./models").User;
const jwt = require("./jwt");

// User authentication function
const authenticateUser = (req, res, next) => {
    // get the credentials form the request object
    const credentials = auth(req);
    if (credentials) {

        // find the user by email address (should be unique)
        User.findOne({'emailAddress': credentials.name}, (error, user) => {
            if (error) {
                console.warn('error in DB search', error);
                res.status(401).json({message: 'Access Denied'})
            }

            if (user) {
                console.log(user)
                // We found a user with this email address.
                // So use bcrypt to compare the hashed password with the given password
                const authenticated = bcrypt.compareSync(credentials.pass, user.password);

                if (!authenticated) {
                    res.status(401).json({message: 'Access Denied'})
                } else {
                    // User is authenticated
                    // Start setting data for the JWT
                    const payload = {
                        id: user._id,
                        name: user.emailAddress,
                    }

                    const signOptions = {
                        issuer: 'fjs-course',
                        subject: user.emailAddress,
                        audience: req.get('origin'),
                    }

                    // get a token by signing the data
                    const token = jwt.signToken(payload, signOptions);

                    // Store user on the req object
                    req.currentUser = user;
                    // also store the token on req object
                    req.jwtToken = token

                    // Call next to continue in the callee route middleware
                    next();
                }
            } else {
                console.warn('users not found');
                res.status(401).json({message: 'Access Denied'})
            }
        })
    } else {
        console.warn('Auth header not found');
        res.status(401).json({message: 'Access Denied'})
    }
}
module.exports = {
    authenticateUser: authenticateUser
}
