

const e = require("express");
const Home = require("../models/home");
const User = require("../models/user");

const requireUser = (req, res) => {
  if (!req.session.user?._id) {
    res.redirect("/login");
    return false;
  }
  return true;
};
exports.getHomes = (req, res, next) => {
  Home.find()
    .then(registeredHomes => {
      res.render("store/home", {
        registeredHomes: registeredHomes,
        pageTitle: "AirBnb homes",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    })
    .catch(next);
};
exports.getIndex = (req, res, next) => {
  Home.find(registeredHomes => {
    console.log(registeredHomes);
    res.render("store/Index", {
      registeredHomes: registeredHomes,
      pageTitle: "Index page",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.getBookings = (req, res, next) => {
  Home.find(registeredHomes => {
    res.render("store/bookings", {
      registeredHomes: registeredHomes,
      pageTitle: "My Bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};


exports.getFavouriteList =async (req, res, next) => {
  if (!requireUser(req, res)) return;

  try {
    const user = await User.findById(req.session.user._id).populate("favourites");
    if (!user) {
      req.session.destroy(() => res.redirect("/login"));
      return;
    }

    res.render("store/favourite", {
      favouriteHomes: user.favourites,
      pageTitle: "My Favourite Homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  } catch (err) {
    next(err);
  }
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then(home => {
      if (!home) {
        return res.status(404).render("404", {
          pageTitle: "Home Not Found",
          isLoggedIn: req.isLoggedIn,
          user: req.session.user
        });
      }

      res.render("store/home-detail", {
        home,
        pageTitle: "Home Details",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    })
    .catch(next);
};

exports.postAddToFavourite = async (req, res, next) => {
  if (!requireUser(req, res)) return;

  try {
    const homeId = req.body.id;
    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).render("404", { pageTitle: "Home Not Found", isLoggedIn: req.isLoggedIn, user: req.session.user });
    }

    await User.findByIdAndUpdate(req.session.user._id, {
      $addToSet: { favourites: home._id }
    });
    return res.redirect("/favourite");
  } catch (err) {
    next(err);
  }
};

exports.postRemoveFavourite = async (req, res, next) => {
  if (!requireUser(req, res)) return;
  const homeId = req.params.homeid;

  if (!homeId) {
    return res.status(400).json({ error: "Home ID is required" });
  }

  try {
    await User.findByIdAndUpdate(req.session.user._id, {
      $pull: { favourites: homeId }
    });
    res.redirect("/favourite");
  } catch (err) {
    next(err);
  }
};
