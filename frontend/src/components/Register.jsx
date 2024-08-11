import { Close, Room } from "@mui/icons-material";
import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";

export default function Register({ setShowRegister }) {
  const baseURL = process.env.REACT_APP_API_URL;

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post(`${baseURL}/users`, newUser);
      setError(false);
      setSuccess(true);
      setIsRegistered(true);
      console.log(res);
    } catch (err) {
      setError(true);
      setSuccess(false);
      setIsRegistered(false);
      console.log(err)
    }
  };

  return (
    <div className="registerContainer">
      <div className="registerLogo">
        <Room className="logoIcon" />
        <span>MapPin</span>
      </div>
      <form onSubmit={onSubmitHandler}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="registerBtn" type="submit" disabled={isRegistered}>
          Register
        </button>
        {success && <span className="success">Successful. You can login now!</span>}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Close
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}