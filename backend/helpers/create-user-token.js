const jwt = require("jsonwebtoken")

const createUserToken = async(user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, "nossosecret")

    res.status(200).json({message: 'autenticado com sucesso!',
    token: token,
    userId: user._id})
}

module.exports = createUserToken;