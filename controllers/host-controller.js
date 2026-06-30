const favourite = require("../models/favourite");
const Home = require("../models/home");
exports.getAddhome =(req,res,next)=>{
  res.render('host/addhome',{pageTitle: 'Add home'});
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
    res.render('host/edit-home',{pageTitle: 'Edit home',editing:editing,home:home});
  });
}

exports.getPosthome=(req,res)=>{
  const {housename,price,photoUrl,rating,description,location}=req.body;
  const home=new Home(housename,price,photoUrl,rating,description,location)
  home.save()
    .then(() => {
      console.log("Home registration succeeded for",req.body);
      res.render('host/addedhome',{pageTitle: 'Added home'});
    })
    .catch((err) => {
      console.error("Error saving home:", err);
      res.status(500).send('Unable to add home.');
    });
}
exports.postEdithome=(req,res)=>{
  const {id,housename,price,photoUrl,rating,description,location}=req.body;
  Home.findById(id,(existingHome)=>{
    if(!existingHome){
      return res.redirect('/host/host-home-list');
    }
    const updatedHome = new Home(housename,price,photoUrl,rating,description,location,id);
    updatedHome.save()
      .then(() => {
        console.log("Home updated successfully for",req.body);
        res.redirect('/host/host-home-list');
      })
      .catch((err) => {
        console.error("Error updating home:", err);
        res.status(500).redirect('/host/host-home-list');
      });
  });
}

exports.getHostHomes = (req,res,next) => {
  Home.fetchALL()
    .then(registeredHomes => {
    console.log(registeredHomes);
    res.render('host/host-home-list', { registeredHomes: registeredHomes, pageTitle: 'host homes' });
  });
};

exports.postDeletehome=(req,res)=>{
  const homeid=req.params.homeid;
  console.log(homeid);
  Home.DeleteById(homeid)
    .then(() => {
    res.redirect('/host/host-home-list');
  })  
  .catch(error=>{
    console.log('Error while deleting',error)
  })
}
