const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtils");

const filepath = path.join(rootDir, "data", "favourite.json");

module.exports = class favourite {
  static AddToFavourite(homeId, callback) {
    fs.readFile(filepath, "utf-8", (err, data) => {
      // If the file doesn't exist yet, start with an empty array instead of crashing
      if (err && err.code === 'ENOENT') {
        data = "[]";
      }
      try {
        let favourites = data ? JSON.parse(data) : [];

        // Check if homeId already exists in favourites
        if (!favourites.includes(homeId)) {
          favourites.push(homeId);
        }

        // Write updated favourites back to file
        fs.writeFile(filepath, JSON.stringify(favourites, null, 2), (writeErr) => {
          if (writeErr) {
            console.error("Failed to write favourite.json:", writeErr);
            return callback(false);
          }
          callback(true);
        });
      } catch (parseErr) {
        console.error("Failed to parse favourite.json:", parseErr);
        return callback(false);
      }
    });
  }

  static getFavourite(callback) {
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        return callback([]);
      }
      try {
        const favourites = data ? JSON.parse(data) : [];
        return callback(favourites);
      } catch (parseErr) {
        console.error("Failed to parse favourite.json:", parseErr);
        return callback([]);
      }
    });
  }

  static findById(homeId, callback) {
    // 1. Changed fetchAll to getFavourite
    this.getFavourite((favourites) => {
      // 2. Since favourites is an array of IDs, we just check if it includes the ID
      const exists = favourites.includes(homeId);
      callback(exists ? homeId : null);
    });
  }

  static RemoveFromFavourite(homeId, callback) {
    fs.readFile(filepath, "utf-8", (err, data) => {
      try {
        let favourites = data ? JSON.parse(data) : [];

        // Remove homeId from favourites array
        favourites = favourites.filter(id => id !== homeId);

        // Write updated favourites back to file
        fs.writeFile(filepath, JSON.stringify(favourites, null, 2), (writeErr) => {
          if (writeErr) {
            console.error("Failed to write favourite.json:", writeErr);
            return callback(false);
          }
          callback(true);
        });
      } catch (parseErr) {
        console.error("Failed to parse favourite.json:", parseErr);
        return callback(false);
      }
    });
  }

  static DeleteById(homeId, callback) {
    // 1. Changed fetchALL to getFavourite
    this.getFavourite((favourites) => {
      // 2. Fixed filter logic (favourite elements are strings, not objects with an id property)
      const updatedFavourites = favourites.filter((id) => id !== homeId);

      // 3. Replaced getFilePath() with filepath variable
      fs.writeFile(filepath, JSON.stringify(updatedFavourites, null, 2), (err) => {
        if (err) {
          console.error("Error writing file in DeleteById:", err);
        }
        if (callback) callback(err);
      });
    });
  }
};