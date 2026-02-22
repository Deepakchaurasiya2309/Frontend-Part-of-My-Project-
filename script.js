document.addEventListener("DOMContentLoaded", function () {

const state = {
  user: null,
  selectedShop: null,
  cart: []
};

const shops = [
  { id: 1, name: "Ravi Kirana" },
  { id: 2, name: "Gupta Store" },
  { id: 3, name: "Jaiswal Kirana" },
  { id: 4, name: "Keshari Store" }
];

const products = [
  { id: 1, name: "Rice", price: 60 },
  { id: 2, name: "Milk", price: 30 },
  { id: 3, name: "Oil", price: 120 },
  { id: 4, name: "Curd", price: 20 },
  { id: 5, name: "Daal", price: 120 },
  { id: 6, name: "AAta", price: 30 },
];

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec =>
    sec.classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

function updateCartCount() {
  document.getElementById("cartCount").innerText =
    state.cart.reduce((sum, item) => sum + item.qty, 0);
}

document.getElementById("loginSubmit").addEventListener("click", () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    state.user = { email };

    document.getElementById("loginBtn").innerText = "Profile";

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    showSection("homeSection");
    

  } else {
    alert("Enter email and password");
  }
});

document.querySelector(".location").addEventListener("click", () => {
  const loc = prompt("Enter your location:");
  if (loc) document.getElementById("currentLocation").innerText = loc;
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  if (!query) return;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    alert("No products found");
    return;
  }

  showSection("productSection");
  renderProducts(filtered);
});


document.querySelectorAll("[data-section]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const target = link.dataset.section;

    // If not logged in
    if (!state.user && target !== "loginSection") {
      alert("Please login first");
      showSection("loginSection");
      return;
    }

    if (state.user && target === "loginSection") {
      showSection("shopSection");
      return;
    }

    showSection(target);

    if (target === "cartSection") renderCart();
    if (target === "shopSection") renderShops();
  });
});
document.getElementById("startShoppingBtn").addEventListener("click", function () {
  showSection("shopSection");
  renderShops();
});

document.querySelector(".cart-icon").addEventListener("click", () => {
  if (!state.user) {
    alert("Please login first");
    showSection("loginSection");
    return;
  }
  showSection("cartSection");
  renderCart();
});


function renderShops() {
  const container = document.getElementById("shops");
  container.innerHTML = "";

  shops.forEach(shop => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${shop.name}</h3>
      <button>View Store</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      state.selectedShop = shop.id;
      showSection("productSection");
      renderProducts(products);
    });
    container.appendChild(card);
  });
}


function renderProducts(productList) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  productList.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button>Add to Cart</button>
    `;
 const btn = card.querySelector("button");

btn.addEventListener("click", () => {
  addToCart(product);
 const currentItem = state.cart.find(item => item.id === product.id);
 const qty = currentItem ? currentItem.qty : 1;

  btn.innerText = `Added (${qty}) ✓`;
  btn.style.backgroundColor = "#03f303";

  setTimeout(() => {
    btn.innerText = "Add to Cart";
    btn.style.backgroundColor = "#ee0f13";
  }, 1200);
});
    container.appendChild(card);
  });
}

function addToCart(product) {
  const existing = state.cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  updateCartCount();
}


function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  let total = 0;

  state.cart.forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name} x ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    `;
    container.appendChild(div);
  });

  document.getElementById("total").innerText = total;
}


document.getElementById("deliveryBtn").addEventListener("click", () => {
  processOrder("Delivery");
});

document.getElementById("pickupBtn").addEventListener("click", () => {
  processOrder("Pickup after 30 minutes");
});
function processOrder(type) {
  if (state.cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const total = state.cart.reduce((sum, item) =>
    sum + item.price * item.qty, 0
  );

  state.cart = [];
  updateCartCount();
  renderCart();

  showSection("successSection");
  document.getElementById("successMessage").innerText =
    `Your order of ₹${total} is confirmed for ${type}.`;
}
const proceedBtn = document.getElementById("proceedToCartBtn");

if (proceedBtn) {
  proceedBtn.addEventListener("click", function () {

    if (state.cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    showSection("cartSection");
    renderCart();
  });
}
});