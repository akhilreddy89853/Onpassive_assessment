const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

const db = require("./app/models");
db.sequelize.sync();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./app/routes/user.routes")(app);
require("./app/routes/employee.routes")(app);



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Onpassive application." });
});


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
