const JWT = require("jsonwebtoken")

const Car = require("../models/carModel")
const Category = require("../models/categoryModel")

const path = require("path")
const uuid = require("uuid")
const fs = require("fs")

const uploadsDir = path.join(__dirname, "../files")


const carCtrl = {
  getCars: async(req, res)=> {
    try {
      const {token} = req.headers
      if(token) {
        const user = await JWT.verify(token, process.env.SECRET_KEY_JWT)
        if(user.role === 'admin') {
          const cars = await Car.find().populate({path:'owner', select: ['name', 'email', 'phone']}).populate('category', 'title')
          res.status(200).send({msg: "mashinalar ro'yhati", cars})
        } else {
          const cars = await Car.find({isPublished: true}).populate({path:'owner', select: ['name', 'email', 'phone']}).populate('category', 'title')
          res.status(200).send({msg: "mashinalar ro'yhati", cars})
        }
      } else {
        const cars = await Car.find({isPublished: true}).populate({path:'owner', select: ['name', 'email', 'phone']}).populate('category', 'title')
        res.status(200).send({msg: "mashinalar ro'yhati", cars})
      }
    } catch (error) {
      res.send({msg: error.message})
    }
  },
  
  searchCars: async (req, res) => {
    try {
      const {title} = req.query
      
      const cars = await Car.aggregate([{$match: {name: {$regex: title, $options: 'i'}}}])
      res.status(200).send({msg: "Topilgan mashinalar ro'yhati", cars})
    } catch (error) {
      res.send({msg: error.message})      
    }
  },

  getCarsByCategory: async(req, res)=> {
    try {
      // populate
      const {token} = req.headers
      const {categoryId} = req.params
      const user = await JWT.verify(token, process.env.SECRET_KEY_JWT)
      if(user.role === 'admin') {
        const cars = await Car.find({category: categoryId})
        res.status(200).send({msg: "mashinalar ro'yhati", cars})
      } else {
        const cars = await Car.find($and [{isPublished: true},{category: categoryId}])
        res.status(200).send({msg: "mashinalar ro'yhati", cars})
      }
    } catch (error) {
      res.send({msg: error.message})
    }
  },

  getCarById: async(req, res)=> {
    try {
      // populate

      const {id} = req.params
      const car = await Car.findById(id)
      if(car) {
        return res.status(200).send({msg: ``, car})
      }
      res.status(404).send({msg: "car not found"})
    } catch (error) {
      res.send({msg: error.message})
    }
  },

  addCar: async (req, res)=> {
    try {
      const {token} = req.headers
      const user = await JWT.verify(token, process.env.SECRET_KEY_JWT)

      const {name, color, year, categoryId, price, typeBody, govermentNumber} = req.body

      const image = req.files.image
      
      const imgName = uuid.v4() + "." + image.mimetype.split("/")[1]

      const imgAddr = "/" + imgName

      image.mv(path.join(uploadsDir, imgName), err=> {
        if(err) {
          console.log(err);          
        }
      })

      const newCar = await Car({name, color, image: imgAddr, year, category: categoryId, price, owner: user.id, typeBody, govermentNumber})

      await newCar.save()

      res.status(201).send({msg: "New car created successfully!", newCar})

    } catch (error) {
      res.send({msg: error.message})
    }
  },

  deleteCar: async(req, res) => {
    try {
      const {id} = req.params
      const car = await Car.findByIdAndDelete(id)
      if(car) {
        fs.unlinkSync(path.join(uploadsDir, car.image))
        return res.status(200).send({msg: `${car.name} car deleted!`})
      }

      res.status(404).send({msg: `car not found!`})
    } catch (error) {
      res.send({msg: error.message})
    }
  },

  updateCar: async(req, res) => {
    try {
      const {id} = req.params
      try {
        const {image} = req.files  
        const car = await Car.findByIdAndUpdate(id, req.body)
        if(car) {
          const imgName = uuid.v4() + "." + image.mimetype.split("/")[1]
  
          const imgAddr = "/" + imgName
  
          image.mv(path.join(uploadsDir, imgName), err=> {
            if(err) {
              console.log(err);          
            }
          })   

          fs.unlinkSync(path.join(uploadsDir, car.image))
          await Car.findByIdAndUpdate(id, {image: imgAddr})
          return res.status(200).send({msg: `${car.name} car updated!`})
        }
  
        res.status(404).send({msg: `car not found!`}) 


      } catch (error) {
        const car = await Car.findByIdAndUpdate(id, req.body)
        if(car) {
          return res.status(200).send({msg: `${car.name} car updated!`})
        }
  
        res.status(404).send({msg: `car not found!`})        
      }
    } catch (error) {
      res.send({msg: error.message})
    }
  },
}


module.exports = carCtrl