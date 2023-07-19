
const {body } = require('express-validator');


class validate {
    static validateUser() {
        return [ body('name','Name Not Contain Number ').not().isEmpty(),//name, email, mobile, password
    body('email','Incorrect email').isEmail(),
    body('password','Password Length must have 8 ').isLength({ min: 8 }),
    body('mobile','Mobile Length must have 10').isLength({ min: 10 },{max: 10}),
     ]
    }
}


module.exports = validate;