const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/authRoute");
const stripeRoute = require("./routes/stripeRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute")
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

const cors = require("cors");

dotenv.config();
 
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connection Successfull to DB!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute); // well done
app.use("/api/carts", cartRoute); // well done
app.use("/api/orders", orderRoute); // well done
app.use("/api/products", productRoute); // well done
app.use("/api/checkout", stripeRoute); 
app.use("/api/users", userRoute); // well done

app.listen(process.env.PORT || 8080, () => {
  console.log("server is running on port 8080");
});


