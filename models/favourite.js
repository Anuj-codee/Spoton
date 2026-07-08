const mongoose=require('mongoose');

const favoriteSchema=mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'home',
    required: true,
    unique: true,
  }
});



module.exports=mongoose.model("favourite", favoriteSchema);
