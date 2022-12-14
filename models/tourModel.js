const mongoose = require('mongoose');
const slugify=require('slugify');
// const validator = require('validator');

//schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have length less than or equal to 40 chracters'],
      minlength: [10, 'A tour must have length more than or equal to 10 chracters'],
      // validate: [validator.isAlpha,'it must conatain Only chracters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message: 'Difficulty is either: easy,medium ,difficult'
      }
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min : [1,'Rating must be above 1.0'],
      max : [5,'Rating must be less than or eual to 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate:{
          // IMPORTANT : this only points to current docs on NEW document creation
          validator: function(val){
            return val < this.price;
          },
          message:'priceDiscount must be less than regular discount'
        }
    }, 

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//QUERY MIDDLEWARES----------------------------------

//this is working only for find not for findOne
// tourSchema.pre('find',function(next){
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// we can do this way but not a good idea
// tourSchema.pre('findOne',function(next){
//   this.find({secretTour :{$ne: true}});
//   next();
// });

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms!`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARES

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

// Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
