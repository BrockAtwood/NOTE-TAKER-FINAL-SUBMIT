//dependanceies needed
const express = require("express");
const fs = require("fs");
//working with other files and directories
const path = require("path");

//express app
const app = express();
//PORT boiler for heroku later, from previous activity #25/#26
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data, from activity #26
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET notes - should return the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/notes.html"));
});

//GET index - should return the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

//app listener for connection
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
