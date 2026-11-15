
// ==========================================
// SREE AVP JEWELLERS POKKISHAM
// FRONTEND DEMO - JAVASCRIPT
// ==========================================

// 1. PRODUCT DATABASE (DEMO DATA)

const products = [
  {
    id: 1,
    name: "Traditional Gold Necklace",
    category: "Gold",
    price: 68500,
    oldPrice: 72000,
    weight: "8.5g",
    purity: "22K",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700",
    badge: "Best Seller",
    description: "An elegant traditional necklace with beautiful craftsmanship.",
    isNew: true
  },
  {
    id: 2,
    name: "Elegant Gold Bangles",
    category: "Bangles",
    price: 45000,
    oldPrice: 48000,
    weight: "6g",
    purity: "22K",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=700",
    badge: "Popular",
    description: "Beautiful bangles designed for special occasions.",
    isNew: true
  },
  {
    id: 3,
    name: "Diamond Pendant Set",
    category: "Diamond",
    price: 38500,
    oldPrice: 41000,
    weight: "3g",
    purity: "18K",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700",
    badge: "New",
    description: "A graceful diamond-inspired pendant collection.",
    isNew: true
  },
  {
    id: 4,
    name: "Classic Silver Anklet",
    category: "Silver",
    price: 4500,
    oldPrice: 5000,
    weight: "25g",
    purity: "925 Silver",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700",
    badge: "Trending",
    description: "Traditional silver anklet with an elegant finish.",
    isNew: false
  },
  {
    id: 5,
    name: "Designer Gold Ring",
    category: "Rings",
    price: 18500,
    oldPrice: 20000,
    weight: "2.5g",
    purity: "22K",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700",
    badge: "Best Seller",
    description: "A stylish ring for everyday elegance.",
    isNew: true
  },
  {
    id: 6,
    name: "Temple Jewellery Necklace",
    category: "Necklaces",
    price: 89500,
    oldPrice: 95000,
    weight: "12g",
    purity: "22K",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700",
    badge: "Exclusive",
    description: "A traditional temple-inspired necklace.",
    isNew: false
  },
  {
    id: 7,
    name: "Premium Diamond Ring",
    category: "Diamond",
    price: 52000,
    oldPrice: 55000,
    weight: "4g",
    purity: "18K",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700",
    badge: "Premium",
    description: "A beautiful diamond-inspired ring design.",
    isNew: true
  },
  {
    id: 8,
    name: "Gold Hoop Earrings",
    category: "Gold",
    price: 22500,
    oldPrice: 24000,
    weight: "3g",
    purity: "22K",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700",
    badge: "Popular",
    description: "Elegant gold earrings for everyday wear.",
    isNew: false
  }
];

// 2. LOCAL STORAGE

function getStoredData(key, fallback = []) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

let cart = getStoredData("avpCart");
let wishlist = getStoredData("avpWishlist");

// 3. BASIC ELEMENTS

const money = value =>
  "₹" + Number(value).toLocaleString("en-IN");

function saveData() {
  localStorage.setItem("avpCart", JSON.stringify(cart));
  localStorage.setItem("avpWishlist", JSON.stringify(wishlist));
}

function showToast(message) {
  const toast = document.getElementById("toastMessage");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}

// 4. PAGE NAVIGATION

const pageSections = document.querySelectorAll(".page-section");
const navigation = document.getElementById("navigation");

function showPage(page) {
  const target = document.getElementById(page);

  if (!target || !target.classList.contains("page-section")) {
    page = "home";
  }

  pageSections.forEach(section => {
    section.classList.toggle("hidden-page", section.id !== page);
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    const hrefPage = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", hrefPage === page);
  });

  navigation.classList.remove("show");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (page === "cart") renderCart();
  if (page === "wishlist") renderWishlist();
  if (page === "shop") renderShop();
}

function navigateTo(page) {
  if (!document.getElementById(page)) return;

  history.pushState({ page }, "", "#" + page);
  showPage(page);
}

function handleNavigation() {
  const page = location.hash.replace("#", "") || "home";

  const validPage = document.getElementById(page);

  if (validPage && validPage.classList.contains("page-section")) {
    showPage(page);
  } else {
    showPage("home");
  }
}

window.addEventListener("hashchange", handleNavigation);

window.addEventListener("popstate", handleNavigation);

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const category = link.dataset.category;
    const target = link.getAttribute("href");

    if (!target || target === "#") {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    if (category) {
      selectedCategory = [category];
      navigateTo("shop");
      updateFilterCheckboxes();
      renderShop();
    } else {
      navigateTo(target.substring(1));
    }
  });
});

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    navigateTo(button.dataset.page);
  });
});

// 5. MOBILE NAVBAR

document.getElementById("menuBtn").addEventListener("click", () => {
  navigation.classList.toggle("show");
});

// 6. PRODUCT CARD DESIGN

function productCard(product) {
  const isWishlisted = wishlist.includes(product.id);

  return `
    <div class="col-6 col-md-4 col-xl-3">
      <div class="product-card">

        <div class="product-image">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

          <span class="product-badge">${product.badge}</span>

          <button
            class="wishlist-btn ${isWishlisted ? "active" : ""}"
            data-wishlist="${product.id}"
            aria-label="Toggle wishlist"
          >
            <i class="bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
        </div>

        <div class="product-info">

          <span class="product-category">${product.category}</span>

          <h3 data-detail="${product.id}">
            ${product.name}
          </h3>

          <p>${product.weight} | ${product.purity}</p>

          <div class="product-price">
            ${money(product.price)}
            <del>${money(product.oldPrice)}</del>
          </div>

          <button class="add-cart-btn" data-add="${product.id}">
            <i class="bi bi-bag-plus"></i> ADD TO CART
          </button>

        </div>
      </div>
    </div>
  `;
}

// 7. DISPLAY HOME PRODUCTS

function renderHome() {
  document.getElementById("newArrivalProducts").innerHTML =
    products.filter(p => p.isNew)
      .slice(0, 4)
      .map(productCard)
      .join("");

  document.getElementById("bestSellerProducts").innerHTML =
    products.slice(0, 4)
      .map(productCard)
      .join("");
}

// 8. ADD TO CART

function addToCart(id) {
  const product = getProduct(id);

  if (!product) return;

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveData();
  updateCounts();

  showToast(product.name + " added to cart!");
}

// 9. REMOVE CART ITEM

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== Number(id));

  saveData();
  updateCounts();
  renderCart();

  showToast("Product removed from cart");
}

// 10. CHANGE QUANTITY

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === Number(id));

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveData();
  updateCounts();
  renderCart();
}

// 11. UPDATE CART COUNTS

function updateCounts() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const wishlistItems = wishlist.length;

  document.getElementById("cartCount").textContent = totalItems;

  document.getElementById("wishlistCount").textContent = wishlistItems;
}

// 12. RENDER CART

function renderCart() {
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-bag"></i>
        <h3>Your Cart Is Empty</h3>
        <p>Discover beautiful jewellery and add your favourites.</p>
        <button class="btn-gold" onclick="navigateTo('shop')">
          EXPLORE PRODUCTS
        </button>
      </div>
    `;

    updateCartTotals(0);
    return;
  }

  let subtotal = 0;

  container.innerHTML = cart.map(item => {
    const product = getProduct(item.id);

    if (!product) return "";

    const total = product.price * item.quantity;

    subtotal += total;

    return `
      <div class="cart-item">

        <img src="${product.image}" alt="${product.name}">

        <div class="cart-item-info">
          <h4>${product.name}</h4>

          <p>${product.weight} | ${product.purity}</p>

          <strong>${money(product.price)}</strong>

          <div class="quantity-control">

            <button
              onclick="changeQuantity(${product.id}, -1)"
              aria-label="Decrease quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              onclick="changeQuantity(${product.id}, 1)"
              aria-label="Increase quantity"
            >+</button>

          </div>

          <button
            class="remove-btn"
            onclick="removeFromCart(${product.id})"
          >
            <i class="bi bi-trash"></i> Remove
          </button>

        </div>

        <strong>${money(total)}</strong>

      </div>
    `;
  }).join("");

  updateCartTotals(subtotal);
}

function updateCartTotals(subtotal) {
  document.getElementById("cartSubtotal").textContent = money(subtotal);
  document.getElementById("cartTotal").textContent = money(subtotal);
}

// 13. WISHLIST

function toggleWishlist(id) {
  id = Number(id);

  const product = getProduct(id);

  if (!product) return;

  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    showToast("Added to wishlist");
  }

  saveData();
  updateCounts();
  refreshProductDisplays();
}

function renderWishlist() {
  const container = document.getElementById("wishlistProducts");

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-heart"></i>
        <h3>Your Wishlist Is Empty</h3>
        <p>Save the jewellery you love here.</p>
        <button class="btn-gold" onclick="navigateTo('shop')">
          EXPLORE COLLECTION
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist
    .map(id => getProduct(id))
    .filter(Boolean)
    .map(productCard)
    .join("");
}

// 14. REFRESH PRODUCT DISPLAYS

function refreshProductDisplays() {
  renderHome();

  if (!document.getElementById("shop").classList.contains("hidden-page")) {
    renderShop();
  }

  if (!document.getElementById("wishlist").classList.contains("hidden-page")) {
    renderWishlist();
  }
}

// 15. PRODUCT DETAIL PAGE

function openProductDetail(id) {
  const product = getProduct(id);

  if (!product) return;

  document.getElementById("productDetailContent").innerHTML = `
    <div class="row g-5 align-items-center">

      <div class="col-md-6">
        <img
          class="detail-image"
          src="${product.image}"
          alt="${product.name}"
        >
      </div>

      <div class="col-md-6 detail-info">

        <span class="eyebrow">${product.category}</span>

        <h1>${product.name}</h1>

        <div class="detail-price">
          ${money(product.price)}
          <del class="text-muted fs-6">${money(product.oldPrice)}</del>
        </div>

        <p>${product.description}</p>

        <hr>

        <p><strong>Purity:</strong> ${product.purity}</p>
        <p><strong>Approximate Weight:</strong> ${product.weight}</p>
        <p><strong>Category:</strong> ${product.category}</p>

        <p class="small-note">
          Display price is illustrative. Final jewellery pricing
          depends on actual weight, purity, making charges and taxes.
        </p>

        <button
          class="btn-gold"
          onclick="addToCart(${product.id})"
        >
          <i class="bi bi-bag-plus"></i> ADD TO CART
        </button>

        <button
          class="btn-gold"
          onclick="toggleWishlist(${product.id})"
        >
          <i class="bi bi-heart"></i> WISHLIST
        </button>

      </div>
    </div>
  `;

  navigateTo("product-detail");
}

// 16. SHOP FILTERS

let selectedCategory = [];
let maxPrice = 100000;

function getFilteredProducts() {
  let result = [...products];

  if (selectedCategory.length > 0) {
    result = result.filter(product =>
      selectedCategory.includes(product.category)
    );
  }

  result = result.filter(product => product.price <= maxPrice);

  const search = document.getElementById("searchInput").value
    .trim()
    .toLowerCase();

  if (search) {
    result = result.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.purity.toLowerCase().includes(search)
    );
  }

  const sort = document.getElementById("sortProducts").value;

  if (sort === "low") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sort === "new") {
    result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }

  return result;
}

function renderShop() {
  const result = getFilteredProducts();

  document.getElementById("shopProducts").innerHTML = result.length
    ? result.map(productCard).join("")
    : `
      <div class="empty-state">
        <i class="bi bi-search"></i>
        <h3>No Products Found</h3>
        <p>Try changing your filters or search.</p>
      </div>
    `;

  document.getElementById("productTotal").textContent =
    result.length + " Products";

  document.getElementById("activeCategory").textContent =
    selectedCategory.length
      ? selectedCategory.join(", ")
      : "All Collections";
}

function updateFilterCheckboxes() {
  document.querySelectorAll("#categoryFilters input").forEach(input => {
    input.checked = selectedCategory.includes(input.value);
  });
}

document.querySelectorAll("#categoryFilters input").forEach(input => {
  input.addEventListener("change", () => {
    selectedCategory = Array.from(
      document.querySelectorAll("#categoryFilters input:checked")
    ).map(el => el.value);

    renderShop();
  });
});

document.getElementById("priceFilter").addEventListener("input", event => {
  maxPrice = Number(event.target.value);

  document.getElementById("priceValue").textContent = money(maxPrice);

  renderShop();
});

document.getElementById("sortProducts").addEventListener("change", renderShop);

document.getElementById("clearFilters").addEventListener("click", () => {
  selectedCategory = [];
  maxPrice = 100000;

  document.getElementById("priceFilter").value = 100000;
  document.getElementById("priceValue").textContent = money(100000);

  updateFilterCheckboxes();
  renderShop();
});

// 17. SEARCH

function searchProducts() {
  selectedCategory = [];

  updateFilterCheckboxes();
  navigateTo("shop");
  renderShop();
}

document.getElementById("searchBtn").addEventListener("click", searchProducts);

document.getElementById("searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    searchProducts();
  }
});

// 18. AUTH TABS

document.querySelectorAll(".auth-tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach(tab => {
      tab.classList.remove("active");
    });

    button.classList.add("active");

    const selectedForm = button.dataset.auth;

    document.querySelectorAll(".auth-form").forEach(form => {
      form.classList.toggle("hidden-page", form.id !== selectedForm);
    });
  });
});

// 19. DEMO LOGIN AND REGISTER

document.querySelectorAll(".auth-form").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    showToast(
      form.id === "loginForm"
        ? "Demo login successful!"
        : "Demo registration completed!"
    );

    form.reset();
  });
});

// 20. CONTACT FORM

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!event.target.reportValidity()) return;

  showToast("Demo enquiry submitted successfully!");

  event.target.reset();
});

// 21. DEMO CHECKOUT

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your shopping cart is empty");
    return;
  }

  const confirmed = confirm(
    "This is a demo checkout. No payment will be collected. Continue?"
  );

  if (confirmed) {
    showToast("Demo order completed successfully!");

    cart = [];

    saveData();
    updateCounts();
    renderCart();
  }
});

// 22. WHATSAPP

const whatsappNumber = ""; // Add store number with country code, e.g. 919876543210

document.getElementById("whatsappLink").addEventListener("click", event => {
  event.preventDefault();

  if (!/^\d{10,15}$/.test(whatsappNumber)) {
    showToast("Please configure the store WhatsApp number first.");
    return;
  }

  const message = encodeURIComponent(
    "Hello SREE AVP JEWELLERS, I would like to know more about your jewellery collection."
  );

  window.open(
    `https://wa.me/${whatsappNumber}?text=${message}`,
    "_blank",
    "noopener,noreferrer"
  );
});

// 23. GLOBAL PRODUCT BUTTON EVENTS

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const wishlistButton = event.target.closest("[data-wishlist]");
  const detailButton = event.target.closest("[data-detail]");

  if (addButton) {
    addToCart(addButton.dataset.add);
  }

  if (wishlistButton) {
    toggleWishlist(wishlistButton.dataset.wishlist);
  }

  if (detailButton) {
    openProductDetail(detailButton.dataset.detail);
  }
});

// 24. INITIALISE WEBSITE

function initialiseWebsite() {
  renderHome();
  renderShop();
  updateCounts();
  handleNavigation();

  document.getElementById("priceValue").textContent = money(100000);

  console.log(
    "SREE AVP JEWELLERS POKKISHAM - Demo website loaded successfully!"
  );
}

initialiseWebsite();
