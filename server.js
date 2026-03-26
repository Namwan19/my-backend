
const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

// ✅ test route
app.get("/", (req, res) => {
  res.send("server ok");
});

app.get("/menu", (req, res) => {
  res.send("menu ok");
});

// ✅ กัน error route อื่น
app.get("/orders", (req, res) => {
  res.send("orders ok");
});


app.get("/order-items/:id", (req, res) => {
  res.send("order items ok");
});

app.post("/order", (req, res) => {
  res.send("order ok");
});


app.put("/orders/:id/status", (req, res) => {
  res.send("status updated");
});


app.put("/orders/:id/confirm", (req, res) => {
  res.send("confirmed");
});


app.delete("/orders/:id", (req, res) => {
  res.send("deleted");
});

// ✅ start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});