const mongoose = require("mongoose");
const port = process.env.PORT || 8000;
const db = require("./config/database");

mongoose.Promise = global.Promise;
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connections successfully");
  });

const app = require("./app");

app.listen(port, () => {
  console.log(`server attivato sulla porta: ${port}`);
});
