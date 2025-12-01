"use client";

import { useState } from "react";
import { API_HOST } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function doRegister(e) {
    e.preventDefault();

    const res = await fetch(API_HOST + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    alert("Account created. You can now login.");
    window.location.href = "/login";
  }

  return (
    <div className="container">
      <h1>Register</h1>

      <form onSubmit={doRegister} style={{ maxWidth: 400 }}>
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
          Register
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
