const router = require("express").Router();
const Pin = require("../models/Pin");
//Node.js ile web sunucusuna gelen istekleri yönetmek için kullanılan express modülü route yönetimi
//Express içerisinde yer alan route web sunucusuna gelen istekleri yönetmek için express modülü ile birlikte gelen static gibi orta katmandır
//Express gelen isteklerin esnek ve düzenli bir şekilde yönetilmesi için Router özelliğini kullanılır
//pin olusturuluyor
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);//title,desc,username vs herseyi body icinde gonderecegiz
  try {
    const savedPin = await newPin.save();//burada async fonk kullanmamizn sebebi burada yeni pini veritabanina kaydediyor ilk once ve kaydetmesi de neredeyse 2 saniye zaman alir await diyince bu satir calisir ve basarlili olunca alta gecer

    res.status(200).json(savedPin);//yanit olarak kaydedilmis pinler gonderilir
  } catch (err) {
    res.status(500).json(err);
  }
});

//pinleri cekiyor 
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);//yanitolarak bir sorun olmadan calistigi iletirlir 
  } catch (err) {
    res.status(500).json(err);// hata olusunca http yanit olarak hata dondurur (sunucu hatsi 500)
  }
});

module.exports = router;
