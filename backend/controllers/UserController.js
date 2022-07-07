const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
// helpers
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const createUserToken = require("../helpers/create-user-token");

module.exports = class UserController {
    static async register(req, res) {
        const {
            name,
            email,
            phone,
            password,
            confirmPassword
        } = req.body;

        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return;
        }

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório!'})
            return;
        }

        if(!phone) {
            res.status(422).json({message: 'O phone é obrigatório!'})
            return;
        }

        if(!password) {
            res.status(422).json({message: 'O password é obrigatório!'})
            return;
        }

        if(!confirmPassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatório!'})
            return;
        }

        if(password !== confirmPassword) {
            res.status(422).json({message: 'A as senhas não são iguais!'})
            return;
        }

        const userExists = await User.findOne({email: email})
        // se variavel foi preenchida quer dizer que usuario ja existe no banco

        
        if(userExists) {
            res.status(422).json({message: 'Por favor utilize outro e-mail!'})
            return;
        }

        // criptografando senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // cria usuario
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await  user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async login(req, res) {
        const {email, password} = req.body

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório!'})
            return;
        }

        if(!password) {
            res.status(422).json({message: 'O password é obrigatório!'})
            return;
        }

        const user = await User.findOne({email: email})
        // se variavel foi preenchida quer dizer que usuario ja existe no banco

        
        if(!user) {
            res.status(422).json({message: 'Não há usuario cadastrado com esse email!'})
            return;
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            res.status(422).json({message: 'Senha inválida!'})
            return;
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {
        let currentUser;
        if(req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')
            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined;
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id;
        const user = await User.findById(id).select("-password")

        try {
            if(!user) {
                res.status(422).json({message: 'Usuário não encontrado!'})
                return;     
            }
        } catch (error) {
            console.log('erro --> ', error)
        }

        res.status(200).json({user})
    }

    static async editUser(req, res) {
        const token = getToken(req)

        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmPassword} = req.body;

        if(req.file) {
            user.image = req.file.filename
        }   


        user.name = name
        // validatons
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return;
        }

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório!'})
            return;
        }

        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists) {
            res.status(422).json({message: 'Utilize outro email!'})
            return;   
        }

        user.email = email

        if(!phone) {
            res.status(422).json({message: 'O phone é obrigatório!'})
            return;
        }

        user.phone = phone

        if(password != confirmPassword) {
            res.status(422).json({message: 'A as senhas não são iguais!'})
            return;
        } else if(password == confirmPassword && password != null) {
            // TODO
            const reqPassword = req.body.password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(reqPassword, salt)
            user.password = passwordHash
        }

        try {
            await User.findOneAndUpdate({
                _id: user._id}, {$set: user}, {new: true})

                res.status(200).json({message: 'Usuário atualizado com sucesso!'})
        } catch (error) {
            res.status(500).json({message: error})
        }


    }
}