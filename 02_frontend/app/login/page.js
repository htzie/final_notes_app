"use client";

import { useState } from "react";
import { API_HOST } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function doLogin(e) {
    e.preventDefault();

    const res = await fetch(API_HOST + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // Save token + user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "/";
  }

  return (
    <div className="container">
      <h1>Login</h1>

      <form onSubmit={doLogin} style={{ maxWidth: 400 }}>
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <button className="button" type="submit" style={{ width: "100%" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
