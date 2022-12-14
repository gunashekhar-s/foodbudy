const jwt = require("jsonwebtoken")
const cryptoJs = require("crypto-js")

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        res.status(401).json({ error: "Authentication token is missing" })
    } else {
        try {
            // decoding recieved token
            const decodedData = cryptoJs.AES.decrypt(token, process.env.CRYPTO_JS_SECRET_KEY).toString(cryptoJs.enc.Utf8);

            // check validity of decrypted token
            const tokenData = jwt.verify(decodedData, process.env.JWT_SECRET_KEY)
            req.token = tokenData
            next()

        } catch (err) {
            res.status(401).json({ error: err.message })
        }
    }
}


const authorizeUser = (req, res, next) => {
    const role = req.token.role
    if (role === "admin") {
        next()
    } else {
        res.status(401).json({ error: "Only admin can make changes" })
    }
}

module.exports = { authenticateUser, authorizeUser }