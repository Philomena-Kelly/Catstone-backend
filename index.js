const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PostModel = require("./postschema");
const CatModel = require("./catschema");
const axios = require("axios");

mongoose.connect(
  "mongodb+srv://pakelly98:Bi0ziZzyu4JTHcTS@catstone.sh889.mongodb.net/catstone?retryWrites=true&w=majority"
);

const db = mongoose.connection;

app.use(express.json());

db.once("open", () => console.log("connected"));
db.on("error", (error) => console.error(error));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/cat", async function (req, res) {
  const newCat = new CatModel(req.body);
  console.log(req.body);
  console.log(newCat);
  const success = await "cat created!";
  newCat.save(function (err, data) {
    if (err) {
      console.log(error);
    } else {
      res.json({ success: "good job" });
    }
  });
});

app.patch("/treat/:name", async function (req, res) {
  const update = req.params.name;
  const cat = await CatModel.findOne({ name: req.params.name });
  const current_count = cat.treat_count + 1;
  db.collection("cats").updateOne(
    { name: req.params.name },
    { $set: { treat_count: current_count } }
  );
  res.json({ success: "good job" });
});

app.post("/post", async function (req, res) {
  const newPost = new PostModel(req.body);
  console.log(req.body);
  console.log(newPost);
  const success = await "post created!";
  newPost.save(function (err, data) {
    if (err) {
      console.log(error);
    } else {
      res.json({ success: "good job" });
    }
  });
});

app.get("/posts/:owner", function (req, res) {
  PostModel.find({ owner: req.params.owner }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send({ data });
    }
  });
});

app.get("/find/:name", async function (req, res) {
  const cat = await CatModel.findOne({ name: req.params.name });
  if (cat) {
    cat.weather = await getWeather(cat.location);
    res.send(cat);
  } else {
    res.send(false);
  }
});

app.get("/user/:username", async function (req, res) {
  const cat = await CatModel.findOne({ owner: req.params.username });

  if (cat) {
    cat.weather = await getWeather(cat.location);
    res.send(cat);
  } else {
    res.send(false);
  }
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});

const getWeather = async (location) => {
  let forecast = false;

  await axios
    .get(
      `http://api.weatherapi.com/v1/forecast.json?key=909df6789cf44ffea9633859222204&q=${location}&aqi=no`
    )
    .then((res) => {
      forecast = res;
    })
    .catch((error) => {
      console.error(error);
    });

  let rain = forecast.data.forecast.forecastday[0].day.daily_will_it_rain;
  let snow = forecast.data.forecast.forecastday[0].day.daily_will_it_snow;

  if (rain) {
    return "rain";
  } else if (snow) {
    return "snow";
  } else {
    return checkTemp(forecast);
  }
};

const checkTemp = (forecast) => {
  if (forecast.data.forecast.cloud > 50) {
    return "cloudy";
  } else if (forecast.data.current.temp_f > 90) {
    return "veryhot";
  } else if (forecast.data.current.temp_f > 60) {
    return "sunny";
  } else if (forecast.data.current.temp_f > 30) {
    return "cloudy";
  } else {
    return "verycold";
  }
};
module.exports = app;
