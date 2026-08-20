const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const DB_path =
  "mongodb+srv://anujmandal5684_db_user:root@cluster0.dflom0z.mongodb.net/";


//Local module
const storeRouter = require("./routes/storeRouter");
const authRouter = require("./routes/authRouter");
const { hostRouter } = require("./routes/hostRouter");
const rootdir = require("./utils/pathUtils");
const multer = require("multer");

const errorHandler = require("./controllers/errors");
const { error } = require("console");

const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const PORT = 3000;

function configureApp(store) {
  app.use(express.static(path.join(__dirname, "public")));

  app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
  });

  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    secret: "Airbnb is good project",
    resave: false,
    saveUninitialized: true,
    store: store,
  }));

  app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    res.locals.userType = req.session.userType;
    next();
  });

  app.use(storeRouter);
  app.use("/host", hostRouter);
  app.use("/host", (req, res, next) => {
    if (req.isLoggedIn) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  app.use(authRouter);
  app.use(errorHandler.pageNotFound);
}

mongoose
  .connect(DB_path)
  .then(() => {
    const store = new MongoStore({
      uri: DB_path,
      collection: "sessions",
    });

    store.on("error", (error) => {
      console.error("Session store error:", error);
    });

    configureApp(store);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to mongo", err);
  });
