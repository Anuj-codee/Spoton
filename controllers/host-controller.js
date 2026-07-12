const favourite = require("../models/favourite");
const Home = require("../models/home");
exports.getAddhome =(req,res,next)=>{
  res.render('host/addhome',{pageTitle: 'Add home',isLoggedIn: req.isLoggedIn,});
}


exports.getEdithome =(req,res,next)=>{
  const homeid=req.params.homeid;
  const editing=req.query.editing==='true';
  Home.findById(homeid)
    .then(home => {
    if(!home){
      console.log("home not found for editing");
      return res.redirect("/host/host-home-list");
    }
    console.log(homeid,editing,home);
    res.render('host/edit-home',{pageTitle: 'Edit home',editing:editing,home:home,isLoggedIn: req.isLoggedIn,});
  });
}

exports.getPosthome=(req,res)=>{
  const {housename,price,photoUrl,rating,description,location}=req.body;
  const home=new Home({
    housename,
    price,
    photoUrl,
    rating,
    description,
    location,
  });

  home.save()
    .then(() => {
      console.log("Home registration succeeded for",req.body);
      res.render('host/addedhome',{pageTitle: 'Added home',isLoggedIn: req.isLoggedIn,});
    })
    .catch((err) => {
      console.error("Error saving home:", err);
      res.status(500).send('Unable to add home.');
    });
}
exports.postEdithome = (req, res, next) => {
  const homeId = req.params.homeid || req.body.id;
  const { housename, price, photoUrl, rating, description, location } = req.body;

  Home.findByIdAndUpdate(homeId, {
    housename,
    price,
    photoUrl,
    rating,
    description,
    location,
  })
    .then(() => {
      console.log("Home updated successfully");
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

exports.getHostHomes = (req,res,next) => {
  Home.find()
    .then(registeredHomes => {
    console.log(registeredHomes);
    res.render('host/host-home-list', { registeredHomes: registeredHomes, pageTitle: 'host homes',isLoggedIn: req.isLoggedIn,});
  });
};

exports.postDeletehome=(req,res)=>{
  const homeid=req.params.homeid;
  console.log(homeid);
  Home.findByIdAndDelete(homeid)
    .then(() => {
    res.redirect('/host/host-home-list');
  })  
  .catch(error=>{
    console.log('Error while deleting',error)
  })
}
exports.postAddHome = (req, res) => {
  const { housename, price, photoUrl, rating, description, location } = req.body;

  const home = new Home({
    housename,
    price,
    photoUrl,
    rating,
    description,
    location,
  });

  home.save()
    .then(() => {
      console.log("Home registration succeeded");
      res.render("host/addedhome", { pageTitle: "Added home" ,isLoggedIn: req.isLoggedIn,});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Unable to add home.");
    });
};