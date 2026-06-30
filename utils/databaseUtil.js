const { MongoClient } = require("mongodb");

const mongoURL =
  "mongodb+srv://root:root@airbnb.mba1v9j.mongodb.net/?appName=Airbnb";

let _db = null;

const mongoConnect = (callback) => {
  if (_db) {
    callback();
    return;
  }

  MongoClient.connect(mongoURL)
    .then((client) => {
      _db = client.db("airbnb");
      callback();
    })
    .catch((err) => {
      console.log("Error while connecting to Mongo", err);
      callback(err);
    });
};

const getDB = () => {
  if (!_db) {
    throw new Error("Mongo not connected");
  }
  return _db;
};

module.exports = {
  mongoConnect,
  getDB,
};
