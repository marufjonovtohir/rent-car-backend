const mongoose = require("mongoose")

const proccessSchema = new mongoose.Schema({
  deadline: {
    type: Number,
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car"
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  price: {
    type: Number,
    default: 200
  },
},
{
  timestamps: true
})

module.exports = mongoose.model("Proccess", proccessSchema)