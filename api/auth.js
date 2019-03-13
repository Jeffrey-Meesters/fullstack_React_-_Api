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
                // We found a user with this email address.
                // So use bcrypt to compare the hashed password with the given password
                const authenticated = bcrypt.compareSync(credentials.pass, user.password);

                if (!authenticated) {
                    res.status(401).json({message: 'Access Denied'})
                } else {
                    // User is authenticated
                    // So store the currentUsr on the request object
                    const payload = {
                        id: user._id,
                        name: user.emailAddress,
                    }

                    const signOptions = {
                        issuer: 'fjs-course',
                        subject: user.emailAddress,
                        audience: req.get('origin'),
                    }

                    const token = jwt.signToken(payload, signOptions);
                    req.currentUser = user;
                    req.jwtToken = token
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
