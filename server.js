const express = require("express");
const port = process.env.port || 8000;
const app = express()


//import routes
const authRoutes = require("./routes/auth")

//middleware
app.use("/api",authRoutes)

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})