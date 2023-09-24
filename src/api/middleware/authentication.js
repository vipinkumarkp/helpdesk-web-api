/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const jwt = require('jsonwebtoken')

const admin_authenticate = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'admin')

        req.user = decode
        next()
    } catch (error) {
        res.status(500).json({
            message: "Authentication Failed"
        })
    }
}

const user_authenticate = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'user')

        req.user = decode
        next()
    } catch (error) {
        res.status(500).json({
            message: "Authentication Failed"
        })
    }
}

const tech_authenticate = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'technician')

        req.user = decode
        next()
    } catch (error) {
        res.status(500).json({
            message: "Authentication Failed"
        })
    }
}

module.exports = {
    admin_authenticate,
    user_authenticate,
    tech_authenticate
}