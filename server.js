const express =require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const Joi = require('joi');

dotenv.config({path: 'config.env'});
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
// Route
const categoryRoute = require('./routes/categoryRoute');
//Connect with db
dbConnection();

//express app
const app=express();

//Parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))
// app.use(express.json());

//Set view engine
app.set("view engine","ejs");


//Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/', categoryRoute);
app.use(express.static(path.join(__dirname, 'uploads')));


// app.all('*', (req, res, next) => {
//   next(new ApiError(`Cant't find this route: ${req.originalUrl}`, 400));
// });

// Global error handling middleware for express
// app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, ()=>{
    console.log(`App running running on port ${PORT}`);
}); 

//Handle rejection outside express
process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(()=>{
      console.error(`Shutting down....`);
      process.exit(1);
    });
});