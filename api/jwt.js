const fs   = require('fs');
const jwt  = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY  = fs.readFileSync('./private.key', 'utf8');
var publicKEY  = fs.readFileSync('./public.key', 'utf8');

signToken = (payload, $Options) => {
    var signOptions = {
        issuer:  $Options.issuer,
        subject:  $Options.subject,
        audience:  $Options.audience,
        expiresIn:  "1d",    // 24 hour validity
        algorithm:  "RS256"    
    };
    return jwt.sign(payload, privateKEY, signOptions);
}

verifyToken = (token, $Options) => {
    var verifyOptions = {
        issuer:  $Options.issuer,
        subject:  $Options.subject,
        audience:  $Options.audience,
        expiresIn:  "1d",
        algorithm:  ["RS256"]
    };
     try{
       return jwt.verify(token, publicKEY, verifyOptions);
     }catch (err){
       return false;
     }
}

decode = (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
}

module.exports = {
    signToken: signToken,
    verifyToken: verifyToken,
    decode: decode,
}