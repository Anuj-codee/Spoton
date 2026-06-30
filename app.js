const express = require("express");
const path = require("path");

//Local module
const storeRouter = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const rootdir = require("./utils/pathUtils");

const errorHandler = require("./controllers/errors");
const { error } = require("console");
const {mongoConnect} = require("./utils/databaseUtil");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use(storeRouter);
app.use(hostRouter);

const PORT = 3000;
app.use(errorHandler.pageNotFound);
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
