const { mongoConnect } = require("../utils/databaseUtil");
const { getDB } = require("../utils/databaseUtil");
const { ObjectId } = require("mongodb");

const normalizeHome = (home) => ({
  housename: home.housename || "",
  price: home.price || "",
  photoUrl: home.photoUrl || home.photourl || home.photoURL || "",
  photourl: home.photourl || home.photoUrl || home.photoURL || "",
  rating: home.rating || "",
  description: home.description || "",
  location: home.location || "",
  _id: home._id || Math.random().toString(),
});

module.exports = class Home {
  constructor(
    housename,
    price,
    photourl = "",
    rating = "",
    description = "",
    location = "",
    _id = null,
  ) {
    this.housename = housename;
    this.price = price;
    this.photoUrl = photourl;
    this.photourl = photourl;
    this.rating = rating;
    this.description = description;
    this.location = location;
    if (_id) {
      this._id = _id;
    }
    // Allow passing an ID when updating
  }
  save() {
    const db = getDB();
    if (this._id) {
      const updateFields = {
        housename: this.housename,
        price: this.price,
        photoUrl: this.photoUrl || this.photourl || "",
        photourl: this.photourl || this.photoUrl || "",
        rating: this.rating,
        description: this.description,
        location: this.location,
      };
      return db
        .collection("homes")
        .updateOne({ _id: new ObjectId(String(this._id)) }, { $set: updateFields });
    } else {
      return db
        .collection("homes")
        .insertOne(this)
        .then((result) => {});
    }
  }
  static fetchALL(callback) {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId, callback) {
    const db = getDB();
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(homeId)) })
      .next();
  }

  static DeleteById(homeId, callback) {
    const db = getDB();
    return db
      .collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
