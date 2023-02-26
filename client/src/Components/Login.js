import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      window.location = "/shift-report";
    } catch (ex) {
      setErrors(ex.response.data);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        {errors && <div style={{ color: "red" }}>{errors}</div>}
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
