const express = require("express");
const config = require("./shared/config");
const path=require('path')
const router = require("./routes");

const app = express();
app.use(express.static('public'))
app.use(express.json())
app.use("/noute.uz", router);

app.listen(config.port, () => {
  console.log(`Server ${config.port}-portda ishlayapti`);
});
