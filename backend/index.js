const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");

dotenv.config();

app.use(express.json());
//asagida mongo db ye baglamak icin url kullandik ama acik olarak kullanmadik
//ayriyetten env dosyasinin icinde MONGO_URL ismine atadik .baska birilerine gorunmesin diye 
mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("MongoDB connected!"))//yukaridaki url ile baglanma kismi basarili olunca consola mongo baglandi mesaji yazdirdik. 
 .catch(err => console.log(err));//hata olunca hatayi dondurur

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
