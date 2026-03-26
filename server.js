const express = require("express");
//const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ================== Middleware ==================
app.use(cors());
app.use(express.json());

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("server ok");
});

app.get("/menu", (req, res) => {
  res.send("menu ok");
});

// ================== MySQL ==================
//const db = mysql.createConnection({
 // host: "YOUR_HOST",
 // user: "YOUR_USER",
 // password: "YOUR_PASSWORD",
  //database: "YOUR_DB"
});

// ================== เพิ่มออเดอร์ ==================
app.post("/order", (req, res) => {
  const { cart, total } = req.body;

//  db.query("INSERT INTO orders (total) VALUES (?)", [total], (err, result) => {
  //  if (err) return res.send(err);

    const orderId = result.insertId;

    cart.forEach(item => {
   //   db.query(
   //     "INSERT INTO order_items (order_id, name, price, qty) VALUES (?, ?, ?, ?)",
   //     [orderId, item.name, item.price, 1]
   //   );
  //  });

    res.send({ message: "success" });
  });
});

// ================== ดึงออเดอร์ ==================
app.get("/orders", (req, res) => {
 // db.query("SELECT * FROM orders", (err, result) => {
 //   if (err) return res.send(err);
 //   res.send(result);
 // });
});

// ================== ดึงสินค้า ==================
app.get("/order-items/:id", (req, res) => {
  const orderId = req.params.id;

 // db.query(
  //  "SELECT * FROM order_items WHERE order_id = ?",
  //  [orderId],
  //  (err, result) => {
   //   if (err) return res.send(err);
  //    res.send(result);
  //  }
 // );
});

// ================== เปลี่ยนสถานะ ==================
app.put("/orders/:id/status", (req, res) => {
  const id = req.params.id;

//  db.query(
  //  "UPDATE orders SET status = CASE WHEN status='wait' THEN 'cooking' WHEN status='cooking' THEN 'done' ELSE 'wait' END WHERE id=?",
   // [id],
   // (err) => {
   //   if (err) return res.send(err);
    //  res.send({ message: "status updated" });
  //  }
 // );
});

// ================== ยืนยัน ==================
app.put("/orders/:id/confirm", (req, res) => {
  const id = req.params.id;

 // db.query(
  //  "UPDATE orders SET status='done' WHERE id=?",
   // [id],
   // (err) => {
   //   if (err) return res.send(err);
   //   res.send({ message: "confirmed" });
  //  }
 // );
});

// ================== ลบ ==================
app.delete("/orders/:id", (req, res) => {
  const id = req.params.id;

  //db.query("DELETE FROM orders WHERE id=?", [id], (err) => {
  //  if (err) return res.send(err);

   // db.query("DELETE FROM order_items WHERE order_id=?", [id]);

   // res.send({ message: "deleted" });
//  });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});