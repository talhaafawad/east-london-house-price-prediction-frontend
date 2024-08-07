import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Register.scss";
import { showFailureToaster } from "../../utils/toaster";
import { auth } from "../../services/authService";
import { userService } from "../../services/userService";

export default function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
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

    try {
      const { error } = userService.newUserSchema.validate(user);
      if (error) {
        setloading(false);
        return showFailureToaster(error.message);
      }

      let { name, email, password, phoneNo } = user;
      let userDetails = {
        name: name,
        email: email,
        password: password,
        phoneNo: phoneNo,
      };

      const isSignup = await userService.addNewUser({ ...userDetails });
      if (isSignup) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  return (
    <div className="registerScreen">
      <form className="registerForm" autoComplete="on" onSubmit={handleSubmit}>
        <span className="registerTitle">Register</span>
        <label htmlFor="name">Username</label>
        <input
          name="name"
          type="text"
          placeholder="Daniyal"
          className="registerInput"
          onChange={handleChange}
          autoComplete="name"
        />
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

        <label htmlFor="phoneNo">Phone No:</label>
        <input
          name="phoneNo"
          type="text"
          placeholder="Enter your phone no."
          className="registerInput"
          onChange={handleChange}
          autoComplete="phoneNo"
        />

        <button disabled={loading} className="registerButton">
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      <button className="registerLoginButton">
        <Link to="/login" className="link">
          Login
        </Link>
      </button>
    </div>
  );
}
