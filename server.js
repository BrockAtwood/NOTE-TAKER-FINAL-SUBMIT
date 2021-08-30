//dependanceies needed
const express = require("express");
const fs = require("fs");
//working with other files and directories
const path = require("path");

//random gnerator dependency
const uuid = require("./helpers/uuid");

//util and util promise for reading fs and using .then
const util = require("util");
const readFromFile = util.promisify(fs.readFile);

// Require the JSON file and assign it to a variable called `termData`
const termData = require("./db/db.json");

//express app
const app = express();
//PORT boiler for heroku later, from previous activity #25/#26
const PORT = process.env.PORT || 3131;

// Middleware for parsing JSON and urlencoded form data, from activity #26
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET notes - should return the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//GET index - should return the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//GET API
app.get("/api/notes", (req, res) => {
  console.log(`${req.method} request received to get notes`);

  readFromFile(termData).then((data) => res.json(JSON.parse(data)));
});

//activity #20: write to a file for writeFile updated notes
const writeToFile = (destination, note) => {
  fs.writeFile(destination, JSON.stringify(note, null, 4), (err) =>
    err ? console.error(err) : console.info("Successfully updated Notes")
  );
};

//obtain and read data and append new note(s)
const append = (content, termData) => {
  fs.readFile(termData, "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      //convert string into json object
      const note = JSON.parse(data);
      //add new note
      note.push(content);
      //write updated notes back to the file
      writeToFile(termData, note);
    }
  });
};

//POST API
app.post("/api/notes", (req, res) => {
  console.log(`${req.method} request received to add a notes`);

  //destructing assignment for the items in req.body activity #20
  const { title, text } = req.body;
  //if all properties are present
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    //adds new note to db
    append(newNote, termData);
    //activity #20
    const response = {
      status: "Well Done!",
      body: newNote,
    };
    res.status(201).json(response);
  } else {
    res.status(500).json("Error with note posting!");
  }
});

//app for deleting a note
app.delete("/api/notes/:id", (req, res) => {});

//app listener for connection
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
