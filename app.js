const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");

const app = express();
const PORT = 5000;

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));

env.config();

mongoose
  .connect(
    `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0-shard-00-00.kihd7.mongodb.net:27017,cluster0-shard-00-01.kihd7.mongodb.net:27017,cluster0-shard-00-02.kihd7.mongodb.net:27017/${process.env.MONGO_DB_DATABASE}?ssl=true&replicaSet=atlas-8y3mc6-shard-0&authSource=admin&retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("Database connected");
  });

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
