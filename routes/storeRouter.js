const express=require('express')
const storeRouter=express.Router();

const storeController=require("../controllers/store-controller");

storeRouter.get("/", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/index", storeController.getIndex);
storeRouter.get("/favourite", storeController.getFavouriteList);
storeRouter.get("/home-detail/:homeId", storeController.getHomeDetails);

storeRouter.post("/favourite", storeController.postAddToFavourite);
storeRouter.post("/favourite/delete/:homeid", storeController.postRemoveFavourite);

module.exports=storeRouter;
