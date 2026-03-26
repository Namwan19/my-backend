// ================= MENU DATA =================
const menu = [
  { name: "กล้วยทอด", price: 30, image: "images/1.jpg" },
  { name: "มันทอด", price: 20, image: "images/2.jpg" },
  { name: "เผือกทอด", price: 20, image: "images/3.jpg" },
  { name: "ไข่นกกระทา", price: 20, image: "images/4.jpg" }
];

// โหลด cart จาก localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= MENU =================
if (document.getElementById("menuList")) {
  const el = document.getElementById("menuList");

  menu.forEach((item, i) => {
    el.innerHTML += `
      <div class="card">
  <img src="${item.image}" alt="${item.name}">
  <h4>${item.name}</h4>
  <p>เริ่มต้น ${item.price} บาท</p>
  <div class="qty-control">
  <button onclick="decreaseMenu(${i})">
    <img src="images/5.svg">
  </button>

  <span id="qty-${i}">0</span>

  <button onclick="increaseMenu(${i})">
    <img src="images/6.svg">
  </button>
</div>
</div>
    `;
  });
    menu.forEach((_, i) => updateMenuUI(i));
}


// เพิ่มลงตะกร้า (ตอนนี้เก็บ qty ด้วย)
function addToCart(i) {
  const item = menu[i];
  const existing = cart.find(x => x.name === item.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("เพิ่มแล้ว ✔");
}

function goCart() {
  window.location.href = "cart.html";
}

// ================= CART =================
if (document.getElementById("cartList")) {
  const el = document.getElementById("cartList");
  let total = 0;

  function renderCart() {
  el.innerHTML = "";
  total = 0;

  if (cart.length === 0) {
    el.innerHTML = "<p>ตะกร้าว่าง</p>";
    document.getElementById("total").innerText = "รวม: 0 บาท";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    el.innerHTML += `
      <div class="item">

        <div class="info">
          ${item.name} - ${item.price} x ${item.qty}
        </div>

        <div class="btn-group">
          <button onclick="increaseQty(${index})">
            <img src="images/6.svg"> </button>
          <button onclick="decreaseQty(${index})">
            <img src="images/5.svg">
          </button>
          <button onclick="removeItem(${index})">
            <img src="images/7.svg">
          </button>
        </div>

      </div>
    `;
  });

  document.getElementById("total").innerText = "รวม: " + total + " บาท";
}

  renderCart();

  window.increaseQty = function(index) {
    cart[index].qty += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  window.decreaseQty = function(index) {
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

function goSummary() {
  window.location.href = "summary.html";
}

// ================= SUMMARY =================
if (document.getElementById("summaryList")) {
  let total = 0;
  const el = document.getElementById("summaryList");

  cart.forEach(item => {
    total += item.price * (item.qty || 1);
    el.innerHTML += `<p>${item.name} - ${item.price} x ${item.qty || 1}</p>`;
  });

  document.getElementById("summaryTotal").innerText = "รวม: " + total + " บาท";
}

function goPayment() {
  window.location.href = "payment.html";
}

// ================= PAYMENT =================
if (document.getElementById("payTotal")) {
  let total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  document.getElementById("payTotal").innerText = "ยอด: " + total + " บาท";
}

function finish() {
  let total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

 fetch("https://my-backend-8mnb.onrender.com/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cart: cart,
      total: total
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("สั่งซื้อสำเร็จ");
    localStorage.removeItem("cart");
    window.location.href = "menu.html";
  })
  .catch(err => {
    alert("error");
    console.log(err);
  });
}

function getMenuQty(name) {
  const item = cart.find(x => x.name === name);
  return item ? item.qty : 0;
}

function updateMenuUI(i) {
  const item = menu[i];
  const el = document.getElementById(`qty-${i}`);
  if (el) el.innerText = getMenuQty(item.name);
}

function increaseMenu(i) {
  const item = menu[i];
  const existing = cart.find(x => x.name === item.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateMenuUI(i);
}

function decreaseMenu(i) {
  const item = menu[i];
  const index = cart.findIndex(x => x.name === item.name);

  if (index !== -1) {
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateMenuUI(i);
}
