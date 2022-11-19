const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController')
const AppError= require('./utils/appError');

const app = express();

// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//    console.log('Hello from the Middleware !!');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//     res.status(200).json({message:'Hello from server side !',app: 'Natours'});
// })

// app.post('/', (req, res) => {
//     res.send("You can post on this URL");
// })

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTE

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//keep this route at last as keeping it above will run always.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message : `can't find ${req.originalUrl} on the server!`

  // })
  // const err = new Error(`can't find ${req.originalUrl} on the server!`);
  // err.statusCode = 404;
  // err.status = 'Fail';



  next(new AppError(`can't find ${req.originalUrl} on the server!`,404));
});

app.use(globalErrorHandler);

// START THE SERVER
module.exports = app;
