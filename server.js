const express = require("express");
const port = process.env.port || 8000;

const app = express()

app.get("/api/signup", (req, res) =>{
    res.json({
        data: "You hit the sigup endpoint"
    })
})

app.listen(port, () =>{
    `Server is running on port ${port}`
})