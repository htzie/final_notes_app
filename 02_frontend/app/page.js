"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function Page() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function checkAuth() {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
    if (!token && typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  async function load() {
    try {
      const res = await apiFetch("/notes");
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch notes:", data);
        alert(data.error || "Failed to fetch notes");
        setNotes([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        setNotes([]);
        return;
      }

      setNotes(data);
    } catch (err) {
      console.error("Error loading notes:", err);
      alert("Error loading notes");
      setNotes([]);
    }
  }

  useEffect(() => {
    checkAuth();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
    load();
  }, []);

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  async function addNote() {
    if (!title.trim()) return alert("Title required");

    await apiFetch("/notes", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    load();
  }

  function startEdit(note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return alert("Title required");

    await apiFetch("/notes/" + id, {
      method: "PUT",
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });

    setEditingId(null);
    load();
  }

  function confirmDelete(id) {
    setDeleteId(id);
    setShowConfirm(true);
  }

  async function performDelete() {
    await apiFetch("/notes/" + deleteId, { method: "DELETE" });
    setShowConfirm(false);
    setDeleteId(null);
    load();
  }

  return (
    <div className="container">
      <div className="header" style={{ alignItems: "center" }}>
  <h1>Your Notes</h1>

  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    {user && (
      <span style={{ fontSize: 14, opacity: 0.8 }}>
        Logged in as: <strong>{user.email}</strong>
      </span>
    )}

    <button className="button" onClick={load}>Refresh</button>
    <button
      className="button"
      style={{ background: "#d9534f" }}
      onClick={logout}
    >
      Logout
    </button>
  </div>
</div>


      <div className="add-card">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="input"
          rows={3}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ marginTop: 8 }}
        />

        <div style={{ marginTop: 8 }}>
          <button className="button" onClick={addNote}>Add Note</button>
        </div>
      </div>

      <div className="notes-grid">
        {notes.map((n) => (
          <div key={n.id} className="note">
            {editingId === n.id ? (
              <>
                <input
                  className="input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <textarea
                  className="input"
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ marginTop: 8 }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  <button className="button" onClick={() => saveEdit(n.id)}>
                    Save
                  </button>
                  <button
                    className="button"
                    style={{ background: "#aaa" }}
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                </div>

                <div className="actions">
                  <button className="button" onClick={() => startEdit(n)}>
                    Edit
                  </button>
                  <button
                    className="button"
                    style={{ background: "#d9534f" }}
                    onClick={() => confirmDelete(n.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              width: 320,
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 8 }}>Delete Note?</h3>
            <p style={{ marginBottom: 16 }}>This action cannot be undone.</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <button className="button" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                className="button"
                style={{ background: "#d9534f" }}
                onClick={performDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
