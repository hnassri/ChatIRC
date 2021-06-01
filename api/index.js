import connectDB from './config/dbs.js'
import registerRoutes from './routes/registerRoute.js'
import loginRoutes from './routes/loginRoute.js'
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

//connect database
connectDB()


dotenv.config()

const app = express()

app.use(
    cors({
        origin: 'http://localhost:4242',
        credentials: true,
    })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.post('/register', registerRoutes)
app.post('/login', loginRoutes)



const PORT = process.env.PORT || 4242

//Express js listen method to run project on http://localhost:5000
app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`))