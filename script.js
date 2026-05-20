// =========================
// NAVBAR SCROLL EFFECT
// =========================

const navbar = document.querySelector(".navbar");

function debounce(func, wait) {
  let timeout;

  return function () {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, arguments);
    }, wait);
  };
}

window.addEventListener(
  "scroll",
  debounce(() => {
    if (window.scrollY > 40) {
      navbar.style.background = "rgba(255,255,255,0.95)";
      navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
    } else {
      navbar.style.background = "rgba(255,255,255,0.8)";
      navbar.style.boxShadow = "none";
    }
  }, 10)
);

// =========================
// CART DRAWER
// =========================

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");

cartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("active");
});

// =========================
// CART MANAGER
// =========================

const cartManager = {

  cart: JSON.parse(localStorage.getItem("cart")) || [],

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  },

  addItem(product) {

    const existing = this.cart.find(
      item => item.name === product.name
    );

    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }

    this.saveCart();
    this.renderCart();
  },

  removeItem(name) {

    this.cart = this.cart.filter(
      item => item.name !== name
    );

    this.saveCart();
    this.renderCart();
  },

  increaseQty(name) {

    const item = this.cart.find(
      item => item.name === name
    );

    if (item) {
      item.quantity++;
    }

    this.saveCart();
    this.renderCart();
  },

  decreaseQty(name) {

    const item = this.cart.find(
      item => item.name === name
    );

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
      this.removeItem(name);
      return;
    }

    this.saveCart();
    this.renderCart();
  },

  getTotal() {

    return this.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

  },

  getCount() {

    return this.cart.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

  },

  renderCart() {

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const total = document.getElementById("total");

    cartCount.innerText = this.getCount();

    total.innerText = `$${this.getTotal()}`;

    if (this.cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-cart">
          <i class="fa-solid fa-cart-shopping"></i>
          <p>Your cart is empty</p>
        </div>
      `;

      return;
    }

    cartItems.innerHTML = this.cart.map(item => {

      return `
      
      <div class="cart-item" data-name="${item.name}">

        <img src="${item.image}" />

        <div class="cart-item-info">

          <h4>${item.name}</h4>

          <p>$${item.price}</p>

          <div class="qty-controls">

            <button class="decrease">
              -
            </button>

            <span>${item.quantity}</span>

            <button class="increase">
              +
            </button>

          </div>

        </div>

        <button class="delete-item">
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>
      
      `;

    }).join("");

  }

};

// INITIAL RENDER

cartManager.renderCart();

// =========================
// ADD TO CART
// =========================

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(button => {

  button.addEventListener("click", () => {

    const card = button.closest(".product-card");

    const product = {

      name: card.querySelector("h3").innerText,

      price: Number(
        card.querySelector(".price")
          .innerText.replace("$", "")
      ),

      image: card.querySelector("img").src

    };

    cartManager.addItem(product);

    // MICRO INTERACTION

    button.innerText = "Added ✓";
    button.style.background = "#22c55e";

    setTimeout(() => {
      button.innerText = "Add to Cart";
      button.style.background = "";
    }, 1000);

  });

});

// =========================
// EVENT DELEGATION
// =========================

document.getElementById("cartItems")
  .addEventListener("click", (e) => {

    const cartItem = e.target.closest(".cart-item");

    if (!cartItem) return;

    const name = cartItem.dataset.name;

    // DELETE

    if (
      e.target.closest(".delete-item")
    ) {

      cartItem.style.opacity = "0";
      cartItem.style.transform = "translateX(50px)";

      setTimeout(() => {
        cartManager.removeItem(name);
      }, 300);

    }

    // INCREASE

    if (
      e.target.closest(".increase")
    ) {

      cartManager.increaseQty(name);

    }

    // DECREASE

    if (
      e.target.closest(".decrease")
    ) {

      cartManager.decreaseQty(name);

    }

  });

// =========================
// REVIEWS
// =========================

const reviews = [

  {
    name: "Sophia Carter",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    stars: "★★★★★",
    text: "Amazing shopping experience. The quality exceeded my expectations and delivery was incredibly fast.",
    date: "April 2026"
  },

  {
    name: "Daniel Lee",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: "★★★★★",
    text: "Beautiful UI, premium products, and outstanding customer support.",
    date: "March 2026"
  },

  {
    name: "Emily Watson",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    stars: "★★★★☆",
    text: "Loved the product quality and packaging. Definitely shopping again.",
    date: "February 2026"
  },

  {
    name: "Michael Brown",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    stars: "★★★★★",
    text: "Fast delivery and premium experience. Highly recommended.",
    date: "January 2026"
  },

  {
    name: "Olivia Smith",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    stars: "★★★★★",
    text: "User-friendly website and excellent customer support service.",
    date: "December 2025"
  },

  {
    name: "James Wilson",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    stars: "★★★★☆",
    text: "Great quality products at affordable prices. Will buy again.",
    date: "November 2025"
  }

];

let current = 0;

const reviewImage = document.getElementById("reviewImage");
const reviewName = document.getElementById("reviewName");
const reviewStars = document.getElementById("reviewStars");
const reviewText = document.getElementById("reviewText");
const reviewDate = document.getElementById("reviewDate");

// =========================
// SHOW REVIEW
// =========================

function showReview(index) {

  const review = reviews[index];

  const card = document.getElementById("reviewCard");

  card.style.transform = "rotateY(90deg)";
  card.style.opacity = "0";

  setTimeout(() => {

    reviewImage.src = review.image;
    reviewName.innerText = review.name;
    reviewStars.innerText = review.stars;
    reviewText.innerText = review.text;
    reviewDate.innerText = review.date;

    card.style.transform = "rotateY(0)";
    card.style.opacity = "1";

  }, 250);

  updateDots();

}

// =========================
// BUTTONS
// =========================

document.getElementById("nextBtn")
  .addEventListener("click", () => {

    current++;

    if (current > reviews.length - 1) {
      current = 0;
    }

    showReview(current);

  });

document.getElementById("prevBtn")
  .addEventListener("click", () => {

    current--;

    if (current < 0) {
      current = reviews.length - 1;
    }

    showReview(current);

  });

document.getElementById("randomBtn")
  .addEventListener("click", () => {

    current = Math.floor(
      Math.random() * reviews.length
    );

    showReview(current);

  });

// =========================
// KEYBOARD SUPPORT
// =========================

document.addEventListener("keydown", (e) => {

  if (e.key === "ArrowRight") {

    current++;

    if (current > reviews.length - 1) {
      current = 0;
    }

    showReview(current);

  }

  if (e.key === "ArrowLeft") {

    current--;

    if (current < 0) {
      current = reviews.length - 1;
    }

    showReview(current);

  }

});

// =========================
// DOTS
// =========================

const dotsContainer = document.getElementById("dots");

reviews.forEach((_, index) => {

  const dot = document.createElement("div");

  dot.classList.add("dot");

  if (index === 0) {
    dot.classList.add("active");
  }

  dot.addEventListener("click", () => {

    current = index;

    showReview(current);

  });

  dotsContainer.appendChild(dot);

});

function updateDots() {

  const dots = document.querySelectorAll(".dot");

  dots.forEach(dot => {
    dot.classList.remove("active");
  });

  dots[current].classList.add("active");

}

showReview(current);