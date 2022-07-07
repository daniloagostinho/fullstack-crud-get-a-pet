const jwt = require("jsonwebtoken")
const getToken = require("./get-token")
const checkToken = (req, res, next) => {
    console.log(req.headers)    

    if(!req.headers.authorization) {
        res.status(401).json({message: 'Acesso negado!'})
        return;
    }
    const token = getToken(req)
    if(!token) {
        res.status(401).json({message: 'Acesso negado!'})
        return;
    }

    try {
        const vefired = jwt.verify(token, 'nossosecret')
        req.user = vefired
        next()
    } catch (error) {
        res.status(400).json({message: 'Token Inválido!'})
    }
}

module.exports = checkToken