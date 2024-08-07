import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Login.scss";
import { showFailureToaster } from "../../utils/toaster";
import { auth } from "../../services/authService";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.getCurrentUserDetails()) navigate("/");
  }, [user]);

  //
  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);

    const { error } = auth.userLoginSchema.validate(user);
    if (error) {
      setloading(false);
      return showFailureToaster(error.message);
    }

    try {
      const isLogin = await auth.login({ ...user });
      // if (isLogin) navigate("/");

      setTimeout(() => {
        if (isLogin) window.location.reload();
      }, 2000);
      setloading(false);

      // setUser({ name: "", email: "", password: "", userType: "" });
    } catch (error) {
      setloading(false);
    }
  };

  return (
    <div className="loginScreen">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>Sign in</h1>

        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="text"
          placeholder="Enter your email address."
          className="registerInput"
          onChange={handleChange}
          autoComplete="email"
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password."
          className="registerInput"
          onChange={handleChange}
          autoComplete="password"
        />
        <button disabled={loading} className="loginButton" type="submit">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <button className="loginRegisterButton">
        <Link to="/register" className="link">
          Register
        </Link>
      </button>
    </div>
  );
}

export default Login;
