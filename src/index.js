const express = require("express");
const config = require("./shared/config");
const router = require("./routes");

const app = express();
app.use("/noute.uz", router);

app.listen(config.port, () => {
  console.log(`Server ${config.port}-portda ishlayapti`);
});
