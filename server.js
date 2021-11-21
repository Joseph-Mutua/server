const express = require("express");
const mongoose = require("mongoose");
const port = process.env.port || 8000;
const mongoURI = process.env.MONGO_URI;
const dotenv = require("dotenv");
dotenv.config();
const app = express();

//Connect to database
mongoose
  .connect(process.env.MONGO_URI, {
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
