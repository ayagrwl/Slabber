const jwt = require('jsonwebtoken')

const secret = 'apni_app_ka_jwt_secret_key_bc'

module.exports = function(req,res,next){
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token.startsWith('Bearer')){
        token = token.slice(7,token.length);
    }
    if(token){
        jwt.verify(token,secret, (err,decoded)=>{
            if(err){
                return res.json({
                    success: false,
                    message: 'Token not valid'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.json({
            success: false,
            message: 'No auth token provided'
        });
    }
}