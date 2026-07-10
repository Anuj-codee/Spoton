const express=require('express')
const authRouter=express.Router();

const authController=require("../controllers/auth-controller");

authRouter.get("/login", authController.getLogin);


module.exports=authRouter;
