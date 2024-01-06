const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
const ExpressError = require("./expressError");
const morgan = require("morgan");
app.use(express.json());

app.use("/items", itemsRoutes);
app.use(morgan("dev"));

/** 404 Handler*/
app.use(function (req, res, next) {
  return new ExpressError("Not Found", 404);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

module.exports = app;
