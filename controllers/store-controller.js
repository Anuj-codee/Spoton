const e = require("express");
const favourite = require("../models/favourite");
const Home = require("../models/home");
exports.getHomes = (req, res, next) => {
  Home.fetchALL()
    .then(registeredHomes => {
      res.render("store/home", {
        registeredHomes: registeredHomes,
        pageTitle: "AirBnb homes",
      });
    })
    .catch(next);
};
exports.getIndex = (req, res, next) => {
  Home.fetchALL(registeredHomes=> {
    console.log(registeredHomes);
    res.render("store/Index", {
      registeredHomes: registeredHomes,
      pageTitle: "Index page",
    });
  });
};

exports.getBookings = (req, res, next) => {
  Home.fetchALL(registeredHomes => {
    res.render("store/bookings", {
      registeredHomes: registeredHomes,
      pageTitle: "My Bookings",
    });
  });
};
exports.getFavouriteList = (req, res, next) => {
  favourite
    .getFavourite()
    .then((favourites) => {
      const favouriteHomeIds = favourites
        .map((fav) => fav.homeId?.toString())
        .filter(Boolean);

      return Home.fetchALL().then((registeredHomes) => {
        const favouriteHomes = registeredHomes.filter((home) =>
          favouriteHomeIds.includes(home._id.toString()),
        );

        res.render("store/favourite", {
          favouriteHomes,
          pageTitle: "My Favourite Homes",
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
        });
      }

      res.render("store/home-detail", {
        home,
        pageTitle: "Home Details",
      });
    })
    .catch(next);
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id;
  const fav=new favourite(homeId);
  console.log(req.body.id);
  console.log(req.body); 
  fav.save().then(result=>{
    console.log('Fav added',result);
  })
  .catch(err=>{
    console.log('error while adding to favorite',err);
  })
  .finally(()=>{
     res.redirect("/favourite");
  })
};

exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.params.homeid;

  if (!homeId) {
    return res.status(400).json({ error: "Home ID is required" });
  }

  favourite.RemoveFromFavourite(homeId, (success) => {
    if (success) {
      res.redirect("/favourite");
    } else {
      res.status(500).json({ error: "Failed to remove from favourites" });
    }
  });
};
