const Car = require("../models/carModel")
const Proccess = require("../models/proccessModel")


const proCtrl = {
  getRentCar: async(req, res) => {
    try {
        const {deadline, carId, userId} = req.body

        const car = await Car.findById(carId)
        if(car.isPublished) {
          await Car.findByIdAndUpdate(carId, {isPublished: false})
  
          const price = (car.price / 30) * deadline
  
          const newProccess = await Proccess({deadline, car: carId, renter: userId, price})

          await newProccess.save()
  
          return res.status(201).send({msg: "Avtomobil sizga berildi", newProccess})
        }
        res.status(404).send({msg: "Avtomobil ijaraga beriligan uzur!"})

    } catch (error) {
        res.send({msg: error.message})
    }
  },

  giveBackCar: async(req, res) => {
    try {
      const {proccessId} = req.params
      const {day} = req.body
      
      const proccess = await Proccess.findById(proccessId)
      if(!proccess) {
        return res.status(401).send({msg: "Avtomobil topshirilgan"})
      }
      
      const diferentDay = day - proccess.deadline
      
      if(diferentDay <= 0) {
        await Car.findByIdAndUpdate(proccess.carId, {isPublished: true})
        await Proccess.findByIdAndDelete(proccessId)
        return res.status(201).send({msg: "Avtomobil qabul qilindi"})
      }      
      
      res.status(200).send({msg: `Xurmatli mijoz siz ${diferentDay} kun uchun qo'shimcha to'lov amalga oshirishingiz kerak!`})

    } catch (error) {
      res.send({msg: error.message})
    }
  }
}


module.exports = proCtrl