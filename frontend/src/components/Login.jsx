import { Close, Room } from "@mui/icons-material";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login({ setShowLogin, myStorage, setCurrentUsername}) {

  const [error, setError] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/auth/login", user);
      myStorage.setItem('user', res.data.user.username);
      setCurrentUsername(res.data.user.username);
      setShowLogin(false);
      console.log(res);
      console.log(res.data.user.username)
    } catch (err) {
      setError(true);
      console.log("ERROR: ", err);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginLogo">
        <Room className="logoIcon" />
        <span>MapPin</span>
      </div>
      <form onSubmit={onSubmitHandler}>
        <input autoFocus placeholder="email" ref={emailRef} type="email"/>
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Close className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}