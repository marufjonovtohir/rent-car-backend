const mongoose = require("mongoose")

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  price: {
    type: Number,
    default: 200
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  typeBody: {
    type: String,
    enum: ['sedan', 'xatchback', 'universal', 'furgon']
  },
  fuelType: {
    type: String,
    default: 'Benzin'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  govermentNumber: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model("Car", carSchema)