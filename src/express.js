const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// serve your css as static
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});

app.listen(9000, () => {
  console.log(
    "Application started and Listening on port http://localhost:9000/"
  );
});

app.on("request", (req, res) => {
  console.log(`Received request for ${req.url}`);
});
