const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors")

const dotenv = require("dotenv");
dotenv.config();
const mongoURI = process.env.MONGO_URI;
const port = process.env.port || 8000;

const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: "http://localhost:3000" }));
}

//Connect to database
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log(`DB CONNECTION ERROR: ${err.message}`);
  });

//import routes
const authRoutes = require("./routes/auth");

//middleware
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
