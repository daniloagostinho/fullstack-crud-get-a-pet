const Pet = require("../models/Pet")

const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")

const ObjectId = require("mongoose").Types.ObjectId

module.exports = class PetController {
    static async create(req, res) {
        const {name, age, weight, color} = req.body;
        const available = true;
        let images = req.files;
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return;
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatório!'})
            return;
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return;
        }

        
        if(!color) {
            res.status(422).json({message: 'A cor é obrigatório!'})
            return;
        }

        if(images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatório!'})
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);
        const pet = new Pet({
            name, 
            age, 
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map(img => {
            pet.images.push(img.filename)
        })
        try {
            const newPet = await pet.save();
            res.status(201).json({message: 'Pet cadastrado com sucesso!', newPet})
        } catch(error) {
            res.status(500).json({message: error})
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        res.status(200).json({pets: pets})
    }

    static async getAllUserPets(req, res) {
        const token = getToken(req);

        const user = await getUserByToken(token)
        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})

    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req);

        const user = await getUserByToken(token)
        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    static async getPetById(req, res) {
        const id = req.params.id;

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID Invalido!'})
            return;
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return;
        }

        res.status(200).json({pet: pet})
    }

    static async removePetById(req, res) {
        const id = req.params.id;

        console.log('id -->>', id)

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID Invalido!'})
            return;
        }

        const pet = await Pet.findOne({_id: id})

        console.log('pet -->> ',  pet)

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return;
        }

        const token = getToken(req)
        const user  = await  getUserByToken(token)
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar a sua solcitação! Tente novamente mais tarde!'})
            return;
        }   

        await Pet.findByIdAndRemove(id)

        res.status(200).json({message: 'Pet excluido com sucesso!'})

    }

    static async updatePet(req, res) {
        const id = req.params.id;
        const {name, age, weight, color, available} = req.body;
        const images = req.files;
    
        const updatedData = {}

        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return;
        }

        const token = getToken(req)
        const user  = await  getUserByToken(token)
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar a sua solcitação! Tente novamente mais tarde!'})
            return;
        }   


        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return;
        } else {
            updatedData.name = name
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatório!'})
            return;
        } else {
            updatedData.age = age
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return;
        } else {
            updatedData.weight = weight
        }

        
        if(!color) {
            res.status(422).json({message: 'A cor é obrigatório!'})
            return;
        } else {
            updatedData.color = color
        }

        if(images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatório!'})
            return;
        } else {
            updatedData.images = []
            images.map(image => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: 'Pet atualizado com sucesso!'})
    }

    static async schedule(req, res) {
        const id = req.params.id;
 
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return;
        }

 
        const token = getToken(req)
        const user  = await  getUserByToken(token)
        if(pet.user._id.equals(user._id)) {
            res.status(422).json({message: 'Você não pode agendar uma visita para seu proprio pet!'})
            return;
        }   

        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({message: 'você já agendou uma visita para este Pet!'})
                return;
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
            }
        )
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id;

        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return;
        }

        const token = getToken(req)
        const user  = await  getUserByToken(token)
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar a sua solcitação! Tente novamente mais tarde!'})
            return;
        }  

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({message: 'Parabems o ciclo de aoção foi finalizado com cusecco!'})


    }
}