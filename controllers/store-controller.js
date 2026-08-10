

const e = require("express");
const favourite = require("../models/favourite");
const Home = require("../models/home");
exports.getHomes = (req, res, next) => {
  Home.find()
    .then(registeredHomes => {
      res.render("store/home", {
        registeredHomes: registeredHomes,
        pageTitle: "AirBnb homes",
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch(next);
};
exports.getIndex = (req, res, next) => {
  Home.find(registeredHomes=> {
    console.log(registeredHomes);
    res.render("store/Index", {
      registeredHomes: registeredHomes,
      pageTitle: "Index page",
      isLoggedIn: req.isLoggedIn,
    });
  });
};

exports.getBookings = (req, res, next) => {
  Home.find(registeredHomes => {
    res.render("store/bookings", {
      registeredHomes: registeredHomes,
      pageTitle: "My Bookings",
      isLoggedIn: req.isLoggedIn,
    });
  });
};
exports.getFavouriteList = (req, res, next) => {
  favourite
    .find()
    .then((favourites) => {
      const favouriteHomeIds = favourites
        .map((fav) => fav.houseId?.toString())
        .filter(Boolean);

      return Home.find().then((registeredHomes) => {
        const favouriteHomes = registeredHomes.filter((home) =>
          favouriteHomeIds.includes(home._id.toString()),
        );

        res.render("store/favourite", {
          favouriteHomes,
          pageTitle: "My Favourite Homes",
          isLoggedIn: req.isLoggedIn,
        });
      });
    })
    .catch(next);
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then(home => {
      if (!home) {
        return res.status(404).render("404", {
          pageTitle: "Home Not Found",
          isLoggedIn: req.isLoggedIn,
        });
      }

      res.render("store/home-detail", {
        home,
        pageTitle: "Home Details",
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch(next);
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id;

  favourite.findOne({ houseId: homeId })
    .then((existingFav) => {
      if (existingFav) {
        return res.redirect("/favourite");
      }

      const fav = new favourite({ houseId: homeId });
      return fav.save().then(() => {
        return res.redirect("/favourite");
      });
    })
    .catch((err) => {
      console.log('error while adding to favorite', err);
      next(err);
    });
};

exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.params.homeid;

  if (!homeId) {
    return res.status(400).json({ error: "Home ID is required" });
  }

  favourite.findOneAndDelete({ houseId: homeId })
    .then(() => {
      res.redirect("/favourite");
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Failed to remove from favourites" });
    });
};
