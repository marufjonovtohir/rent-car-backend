const express = require("express")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const userRouter = require("./src/routes/userRouter")
const carRouter = require("./src/routes/carRouter")
const categoryRouter = require("./src/routes/categoryRouter")
const proccessRouter = require("./src/routes/proRouter")


dotenv.config()

const app = express()

const PORT = process.env.PORT || 4001


// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(fileUpload({useTempFiles: true}))
app.use(express.static("./src/files"))

// Routes
app.use(userRouter)
app.use(carRouter)
app.use(categoryRouter)
app.use(proccessRouter)



app.get('/', (req, res)=> {
  res.send('ok')
})


const start = async()=> {
  try {
    await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})

    app.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`))

  } catch (error) {
    console.log(error);
    process.exit()
  }
}


start()
