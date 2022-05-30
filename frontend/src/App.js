import "./app.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
// eslint-disable-next-line 
import { Room, Star, StarBorder } from "@material-ui/icons";
import axios from "axios"; //http cagrilarini kolayca yapmamizi saglar
import { format } from "timeago.js"; //pinin ne zaman olusturuldugunu bildirir
import Register from "./components/Register";
import Login from "./components/Login";

//react hook bir class olusturmadan reactin ozelliklerini kullanmamiza yarar
function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0); //use state func kullanilarak star ve viewport ayarlanir
  const [viewport, setViewport] = useState({ //baslangicta olusturulacak konum 
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false); //login oldugunda true yapilacak

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long }); //pin yapildaginda pinin degerlerini tutar
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoibWVyZGFua3VyYmFub3YiLCJhIjoiY2wzbHhodTI2MDJiczNpbHVoNnpsa2RoaCJ9.tRWCsehz3ejn9O14lYXrTA"
        
        width="100%"
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/merdankurbanov/cl3m11ppr005b14mla20z96z2"
        //"mapbox://styles/merdankurbanov/cl3m11ppr005b14mla20z96z2"
        //"mapbox://styles/merdankurbanov/cl3mqzkik000w14qa242r1n80"
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={currentUsername && handleAddClick} //harita icin ve full screende kaydirabilmek icin
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color:
                    currentUsername === p.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)} //pop up i kapatir
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}> 
                  <label>Konum</label>
                  <input
                    placeholder="Başlık ekle"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Açıklama</label>
                  <textarea
                    placeholder="İşaretlenen konum hakkında yorum yaz"
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Puan</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                  Konum işaretle
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Çıkış
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Giris
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Kayit
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
