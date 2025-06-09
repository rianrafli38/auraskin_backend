let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  cartSidebar.classList.toggle('translate-x-full');
}

function addToCart(id, name, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    cartItems.innerHTML += `
      <div class="flex items-center space-x-4">
        <img src="${item.image}" class="w-12 h-12 rounded"/>
        <div class="flex-1">
          <p class="font-semibold">${item.name}</p>
          <div class="flex items-center space-x-2 mt-1">
            <button onclick="decreaseQty(${index})" class="px-2 py-1 bg-gray-200 rounded">−</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty(${index})" class="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <p class="text-sm text-gray-500 mt-1">Rp${item.price.toLocaleString()}</p>
        </div>
      </div>
    `;
  });

  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  cartTotal.textContent = total.toLocaleString();
}

function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
  updateCartUI();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}