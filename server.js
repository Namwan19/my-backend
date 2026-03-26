const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// ================== Middleware ==================
app.use(cors());
app.use(express.json());

// ให้ Express รู้จักโฟลเดอร์ public
app.use(express.static(path.join(__dirname, "public")));

// ================== Route HTML ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html")); // หน้าแรกเปิด menu.html
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cart.html")); // ถ้ามีไฟล์ cart.html
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html")); // ถ้ามีไฟล์ home.html
});

// ================== MySQL ==================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "food_app"
});

// ================== เพิ่มออเดอร์ ==================
app.post("/order", (req, res) => {
  const { cart, total } = req.body;

  db.query("INSERT INTO orders (total) VALUES (?)", [total], (err, result) => {
    if (err) return res.send(err);

    const orderId = result.insertId;

    cart.forEach(item => {
      db.query(
        "INSERT INTO order_items (order_id, name, price, qty) VALUES (?, ?, ?, ?)",
        [orderId, item.name, item.price, 1]
      );
    });

    res.send({ message: "success" });
  });
});

// ================== ดึงออเดอร์ ==================
app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

// ================== ดึงสินค้า ==================
app.get("/order-items/:id", (req, res) => {
  const orderId = req.params.id;

  db.query(
    "SELECT * FROM order_items WHERE order_id = ?",
    [orderId],
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

// ================== เปลี่ยนสถานะ ==================
app.put("/orders/:id/status", (req, res) => {
  const id = req.params.id;

  db.query(
    "UPDATE orders SET status = CASE WHEN status='wait' THEN 'cooking' WHEN status='cooking' THEN 'done' ELSE 'wait' END WHERE id=?",
    [id],
    (err) => {
      if (err) return res.send(err);
      res.send({ message: "status updated" });
    }
  );
});

// ================== ยืนยัน ==================
app.put("/orders/:id/confirm", (req, res) => {
  const id = req.params.id;

  db.query(
    "UPDATE orders SET status='done' WHERE id=?",
    [id],
    (err) => {
      if (err) return res.send(err);
      res.send({ message: "confirmed" });
    }
  );
});

// ================== ลบ ==================
app.delete("/orders/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM orders WHERE id=?", [id], (err) => {
    if (err) return res.send(err);

    db.query("DELETE FROM order_items WHERE order_id=?", [id]);

    res.send({ message: "deleted" });
  });
});

// ================== START SERVER ==================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});