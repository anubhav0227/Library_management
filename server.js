
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    year INT,
    genre VARCHAR(255),
    status VARCHAR(50)
  )
`);

// ➕ Add book
app.post("/books", (req, res) => {
  const { title, author, year, genre, status } = req.body;
  db.query(
    "INSERT INTO books (title, author, year, genre, status) VALUES (?, ?, ?, ?, ?)",
    [title, author, year, genre, status],
    (err) => {
      if (err) res.status(500).send(err);
      else res.send({ message: "Book added successfully" });
    }
  );
});

// 📖 Get all books
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) res.status(500).send(err);
    else res.send(results);
  });
});

// ✏️ Update book
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, year, genre, status } = req.body;
  db.query(
    "UPDATE books SET title=?, author=?, year=?, genre=?, status=? WHERE id=?",
    [title, author, year, genre, status, id],
    (err) => {
      if (err) res.status(500).send(err);
      else res.send({ message: "Book updated successfully" });
    }
  );
});

// ❌ Delete book
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM books WHERE id=?", [id], (err) => {
    if (err) res.status(500).send(err);
    else res.send({ message: "Book deleted successfully" });
  });
});

app.listen(8080, () => console.log("Server running on port 8080"));
