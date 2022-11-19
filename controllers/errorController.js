const AppError= require("../utils/appError")



const handleValidationErrorDB = err =>{
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
}
const handleDuplicateFieldsDB = err =>{
  const value= err.keyValue.name;
  console.log(value);
  const message = `Duplicate Field value : ${value}. please use another.`
}
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
}

const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        stack: err.stack,
        error: err,
        message: err.message,
      });
}

const sendErrProd = (err, res)=>{
    //Operational , trusted error : error sent to the client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
          });
    }
    // programming error or unknown error : dont leak error details
    else{
        //Log error
        console.log('Error', err);

        // send genric message
       res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!!'

       })
    }
   
}


module.exports =(err, req, res, next) => {

    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 404;

    if(process.env.NODE_ENV === 'development'){
      // let error = { ...err };
      // if(err.name === "ValidationError"){
      //   error = handleValidationErrorDB(error);
      // }
    
      sendErrorDev(err,res);

    }
    else if(process.env.NODE_ENV === 'production'){
        let error = { ...err };
        if(error.name === 'CastError'){
            error = handleCastErrorDB(error);
        }

        if(err.code===11000){
           error = handleDuplicateFieldsDB(error);
        }

        if(err.name === "ValidationError"){
          error = handleValidationErrorDB(error);
        }

        sendErrProd(err,res);
    }
  }