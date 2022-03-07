const mongoose = require("mongoose");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const users = require("./routes/users");
const auth = require("./routes/auth");
const cards = require("./routes/cards");

mongoose
  .connect("mongodb://localhost/rest_api_project")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Could not connected to MongoDB"));

app.use(cors());
app.use(express.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/cards", cards);

const PORT = 3900;
http.listen(PORT, () => console.log(`listening to port: ${PORT}`));
