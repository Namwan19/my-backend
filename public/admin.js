function loadOrders() {
  fetch("http://localhost:3000/orders")
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById("orderList");
      el.innerHTML = "";

      data.forEach(order => {
        const div = document.createElement("div");
        div.className = "order-card";

        // สถานะ
        let statusText = "รอ";
        let statusClass = "wait";

        if (order.status === "cooking") {
          statusText = "กำลังทำ";
          statusClass = "cooking";
        }
        if (order.status === "done") {
          statusText = "เสร็จแล้ว";
          statusClass = "done";
        }

        div.innerHTML = `
          <h3>ออเดอร์ #${order.id}</h3>
          <span class="status ${statusClass}">${statusText}</span>
          <p>รวม: ${order.total} บาท</p>

          <div class="items" id="items-${order.id}">กำลังโหลด...</div>

          <div class="btn-group">
            <button class="next" onclick="nextStatus(${order.id})">เปลี่ยนสถานะ</button>
            <button class="confirm" onclick="confirmOrder(${order.id})">ยืนยัน</button>
            <button class="delete" onclick="deleteOrder(${order.id})">ลบ</button>
          </div>
        `;

        el.appendChild(div);

        // โหลดสินค้า
        fetch(`http://localhost:3000/order-items/${order.id}`)
          .then(res => res.json())
          .then(items => {
            const itemEl = document.getElementById(`items-${order.id}`);
            itemEl.innerHTML = "";

            items.forEach(i => {
              itemEl.innerHTML += `<p>${i.name} - ${i.price} บาท</p>`;
            });
          });
      });
    });
}

/* เปลี่ยนสถานะ */
function nextStatus(id) {
  fetch(`http://localhost:3000/orders/${id}/status`, {
    method: "PUT"
  }).then(() => loadOrders());
}

/* ยืนยันออเดอร์ */
function confirmOrder(id) {
  fetch(`http://localhost:3000/orders/${id}/confirm`, {
    method: "PUT"
  }).then(() => loadOrders());
}

/* ลบออเดอร์ */
function deleteOrder(id) {
  fetch(`http://localhost:3000/orders/${id}`, {
    method: "DELETE"
  }).then(() => loadOrders());
}

loadOrders();