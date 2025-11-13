// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";   // <-- IMPORTANT

const API = "http://localhost:8080/books";

export default function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    status: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchBooks = async () => {
    const res = await axios.get(API);
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ title: "", author: "", year: "", genre: "", status: "" });
    fetchBooks();
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setForm(b);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchBooks();
  };

  return (
    <div className="app-container">
      <h1>Library Management App</h1>

      <div className="content-box">
        
        {/* LEFT: Form */}
        <div className="form-box">
          <h2>{editId ? "Edit Book" : "Add New Book"}</h2>

          <form onSubmit={handleSubmit}>
            {["title", "author", "year", "genre", "status"].map((f) => (
              <input
                key={f}
                name={f}
                value={form[f]}
                onChange={handleChange}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                required
              />
            ))}

            <button type="submit">
              {editId ? "Update Book" : "Add Book"}
            </button>
          </form>
        </div>

        {/* RIGHT: Table */}
        <div className="table-box">
          <h2>Book Records</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Author</th><th>Year</th>
                <th>Genre</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.year}</td>
                  <td>{b.genre}</td>
                  <td>{b.status}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(b)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {books.length === 0 && (
                <tr>
                  <td colSpan="7">No books available.</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}
