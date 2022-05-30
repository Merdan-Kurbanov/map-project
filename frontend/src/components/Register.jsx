import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>GeziKaydı</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="Kullanıcı ismi" ref={usernameRef} />
        <input type="email" placeholder="Mail" ref={emailRef} />
        <input
          type="password"
          min="6"
          placeholder="Parola"
          ref={passwordRef}
        />
        <button className="registerBtn" type="submit">
          Kayıt Ol
        </button>
        {success && (
          <span className="success">Hesabınız oluşturuldu.Giriş yapabilirsiniz</span>
        )}
        {error && <span className="failure">Sıfre veya kullanıcı ismi hatalı!</span>}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
