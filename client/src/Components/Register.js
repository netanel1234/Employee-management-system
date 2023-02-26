import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/register", {
        username,
        password,
      });
    } catch (ex) {
      setErrors(ex.response.data);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Register a new user</h1>
        <br />
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
        Is admin ? <input type="checkbox" />
        <br /> <br />
        {errors && <div style={{ color: "red" }}>{errors}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
