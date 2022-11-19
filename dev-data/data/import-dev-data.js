const fs = require('fs');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour= require('./../../models/tourModel')

dotenv.config({path:'./config.env'});

const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology:true,
  useCreateIndex: true,
}).then(con=>{
  // console.log(con.connections)
  console.log('DB connection established')
}
)

//READ JSON FILE

const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

//IMPORT DATA TO DB
const importData = async() =>{
    try{
        await Tour.create(tours);
        console.log("Data Loaded Succesfully");

    } catch(err){
        console.log(err);

    }
}

//DELETE ALL DATA FROM DATABASE_PASSWORD
const deleteData = async() =>{
    try{
        await Tour.deleteMany();
        console.log("data deleted successfully!");
        process.exit();

    }catch(err){
        console.log(err);
    }
}

if(process.argv[2]==='--import'){
    importData();
}
else if(process.argv[2]==='--delete'){
    deleteData();
}
