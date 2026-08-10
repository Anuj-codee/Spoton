/*
  this.housename = housename;
    this.price = price;
    this.photoUrl = photourl;
    this.photourl = photourl;
    this.rating = rating;
    this.description = description;
    this.location = location;
*/ 
/* 
   save()
   static fetchALL(callback) 
   static findById(homeId, callback)
   static DeleteById(homeId, callback)
*/
const mongoose=require('mongoose');
const favourite = require('./favourite');

const homeSchema = new mongoose.Schema({
  housename: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  photoUrl: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  description: {
    type: String,
  },
});

homeSchema.pre('findOneAndDelete',async function (next) {
  // Pre-delete middleware for home documents
  const homeId = this.getQuery()._id;
  await favourite.deleteOne({ houseId: homeId });

});

module.exports = mongoose.model("Home", homeSchema);
