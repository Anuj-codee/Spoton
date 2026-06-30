const express=require('express')
const hostRouter=express.Router();
const path=require('path')
const rootdir=require("../utils/pathUtils")

const hostController = require("../controllers/host-controller");
const storeController = require("../controllers/store-controller");

hostRouter.get("/host/add-home", hostController.getAddhome);
hostRouter.post("/host/add-home", hostController.getPosthome);
hostRouter.get("/host/bookings", storeController.getBookings);
hostRouter.get("/host/host-home-list", hostController.getHostHomes);

hostRouter.get("/host/edit-home/:homeid", hostController.getEdithome);
hostRouter.post("/host/edit-home/:homeid", hostController.postEdithome);

hostRouter.post("/host/host-home-delete/:homeid", hostController.postDeletehome);


exports.hostRouter=hostRouter;

