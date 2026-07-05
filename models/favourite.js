

module.exports = class favourite {
  constructor(homeId) {
    this.homeId = homeId;
  }

  save() {
    const db = getDB();
    return db.collection('favourites').findOne({homeId: this.homeId})
    .then(existingfav=> {
      if(!existingfav){
        return db.collection("favourites").insertOne(this);
      }
      return Promise.resolve();
    })
    
  }

  static getFavourite() {
    const db = getDB();
    return db.collection("favourites").find().toArray();
  }

  static findById(homeId, callback) {
    return this.getFavourite().then((favourites) => {
      const exists = favourites.some(
        (fav) => fav.homeId?.toString() === String(homeId),
      );
      if (callback) {
        callback(exists ? homeId : null);
      }
      return exists ? homeId : null;
    });
  }

  static RemoveFromFavourite(homeId, callback) {
    const db = getDB();
    return db
      .collection("favourites")
      .deleteMany({ homeId: String(homeId) })
      .then((result) => {
        if (callback) {
          callback(result.deletedCount > 0);
        }
        return result;
      });
  }

  static DeleteById(homeId, callback) {
    return this.RemoveFromFavourite(homeId, callback);
  }
};
