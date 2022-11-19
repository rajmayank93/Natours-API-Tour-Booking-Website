class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
  
      //1B)ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
      //  console.log(JSON.parse(queryStr));
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
  
      // let query = Tour.find(JSON.parse(queryStr));
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        // query=query.sort(req.query.sort); // This was just single sort criteria
        this.query = this.query.sort(sortBy); // this one when it has tie so second reference
      } else {
        this.query = this.query.sort('createdAt');
      }
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      // important thing to skip and watch limited components
  
      this.query = this.query.skip(skip).limit(limit);
  
      // if(this.queryString.page){
      //   const numTours= await Tour.countDocuments();
      //   if(skip>=numTours){
      //     throw new Error();
      //   }
      // }
      return this;
    }
  }

  module.exports = APIFeatures;