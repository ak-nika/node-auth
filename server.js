const express = require("express");
const mongoose = require("mongoose");
const app = require("./app");

const connectionString = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
