const fs = require('fs');
const jwt = require('jsonwebtoken');
// info: https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
// use 'utf8' to get string instead of byte array  (512 bit key)
const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8');

signToken = (payload, $Options) => {
    const signOptions = {
        issuer: $Options.issuer,
        subject: $Options.subject,
        audience: $Options.audience,
        expiresIn: "1m", // 24 hour validity
        algorithm: "RS256"
    };
    return jwt.sign(payload, privateKEY, signOptions);
}

verifyToken = (token, $Options) => {
    const verifyOptions = {
        issuer: $Options.issuer,
        subject: $Options.subject,
        audience: $Options.audience,
        expiresIn: "1d",
        algorithm: ["RS256"]
    }
    try {
        return jwt.verify(token, publicKEY, verifyOptions);
    } catch (err) {
        return false;
    }
}

decode = (token) => {
    //returns null if token is invalid
    return jwt.decode(token);
}

module.exports = {
    signToken: signToken,
    verifyToken: verifyToken,
    decode: decode,
}
