const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'});
const app= require('./app')


// handle caught exceptions

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTIONS !! sHUTTING DOWN!');
  console.log(err.name, err.message);
});

const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology:true,
}).then(()=>{
  // console.log(con.connections)
  console.log('DB connection established')
}
);



// to save in databse

// const testTour = new Tour({
//   name : 'The Park Camper',
//   price : 997
// });

// testTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('Error :',err);
// });

// console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


//handle unhandled rejections
process.on('unhandledRejection', err => {
  console.log(err.name , err.message);
  console.log('UNHANDLED REJECTION !! SHUTTING DOWN');
  server.close(() => {
    process.exit(1);
  });
});





