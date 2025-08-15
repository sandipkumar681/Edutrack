import "./dotenv.js";
import app from "./src/app.js";
import connectToMongo from "./src/dbs/db.js";

connectToMongo()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Can't connect to MongoDB!", error);
  });
