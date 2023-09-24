/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const  cors = require('cors');
// Import project files
const dbClient = require('./db')
const userRouter = require('../api/authentication/authRoute')
const customerRouter = require('../api/user/userRoute')
const technicianRouter = require('../api/technician/technicianRoute')
const adminRouter = require('../api/admin/adminRoute');
const employeeRouter = require('../api/employee/employeeRoute')
const categoryRouter = require('../api/category/categoryRoute')
const brandRouter = require('../api/brand/brandRoute')
const departmentRouter = require("../api/department/departmentRoute")

const authentication = require('../api/middleware/authentication')
const app = express()

// Env cofiguration
require('dotenv').config()

// Required variabls
const port = process.env.PORT || 8000
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:4000','http://localhost:3000', "http://codea-helpdesk.s3-website-ap-southeast-2.amazonaws.com"], credentials: true }))
// App configuration
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())

// Connecting DB
dbClient.connect()
// Checking DB status
dbClient.on('connect', () => console.log('Database connection established'))
dbClient.on('error', ()=> console.log('Database connection ends'))

// Root
app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html')
})

app.use('/api/v1/users', userRouter),
app.use('/api/v1/admin', adminRouter),
app.use('/api/v1/customers', customerRouter),
// app.use('/api/v1/technicians', authentication.tech_authenticate, technicianRouter)
app.use('/api/v1/technicians', technicianRouter)

app.use('/api/v1/employee', employeeRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/brand', brandRouter)
app.use('/api/v1/department', departmentRouter)

// Back-end server connection
app.listen(port, () => console.log(`Server connection established and running on port: ${port}`))