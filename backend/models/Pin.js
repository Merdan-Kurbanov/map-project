const mongoose = require("mongoose");
// Node.js ile geliştirilen uygulamaya uygun model oluşturmak ve MongoDB işlemlerini daha kolay hale getirmekte kullaniyoruz
const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);
//Yukarıdaki kod bloğunu incelerseniz eğer bir modelin nasıl oluşturulduğunu görmekteyiz
//Mongoose modülü üzerinden “model” fonksiyonu geriye exports edilmektedir
// Fonksiyonun ilk parametresi bu modelin veritabanında hangi collectiona ait olduğu bilgisini tutmaktadır. İkinci parametre ise Mongoose modülünde bulunan Schema sınıfında bir nesne almaktadır. Haliyle görüldüğü üzere Schema nesnesi içerisinde ilgili modelimiz tanımlamış bulunmaktadır. Bir başka deyişle modelimizin alanları veri tipleriyle birlikte tanımlanmıştır.