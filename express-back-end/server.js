const Express = require("express");
const App = Express();
const BodyParser = require("body-parser");
const getActivities = require("./routes/getActivities");
const PORT = 8080;
const data = require("./db.json");
const cors = require("cors");
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

const getName = require('./queries/itineraries');

const getAllItineraries = require('./routes/getAllItineraries')
const getItinerary = require('./routes/getItinerary')

// Express Configuration
App.use(
  cors({
    origin: "http://localhost:3000",
  })
);
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());
App.use(Express.static("public"));

// Sample GET route
App.use("/api/activities", async function (req, res) {
  const body = req.body
  const activities = await getActivities(db, body);
  res.json({
    message: "Success, able to get data from api",
    act: activities,
  });
});

App.use("/api/itineraries", async function (req, res) {
  const itineraries = await getAllItineraries(db);
  res.json({
    itineraries: itineraries
  })
});

App.use("/api/itinerary", async function (req, res) {
  console.log(req.body)
  const itinerary = await getItinerary(db, req.body.id);
  console.log('itinerary', itinerary)
  // res.json({
  //   itinerary: itinerary
  // })
});

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express seems to be listening on port ${PORT} so that's pretty good 👍`
  );
});
