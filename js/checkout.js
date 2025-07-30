let cart = document.querySelector(".cart");
function open_cart() {
  cart.classList.toggle("active");
}

let back_to_top = document.querySelector(".to-top");
back_to_top.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
let links = document.querySelector(".links");
function open_menu() {
  links.classList.add("active");
}
function close_menu() {
  links.classList.remove("active");
}
let filter = document.querySelector(".filter");
function close_open_filter() {
  filter.classList.toggle("active");
}

var all_products_json; // This will be populated by your fetch request
let Check_products = document.getElementById("checkout-items");
let cart_products = document.querySelector(".cart-products");
let checkout_total = document.querySelector(".total_checkout");
let product_cart = []; // This array will store products with their quantities
let count_cart_element = document.querySelector(".count-cart");

let imgs = document.querySelectorAll(".imgs img");
let main_img = document.querySelector(".main-img img");
imgs.forEach((img) => {
  img.addEventListener("click", () => {
    main_img.src = img.src;
  });
});

function add_to_cart(id, btn) {
  if (!all_products_json || !all_products_json[id]) {
    console.error("Product data not found for ID:", id);
    return;
  }

  // Find if the product already exists in the cart
  let existingProduct = product_cart.find(
    (product) => product.id === all_products_json[id].id
  );

  if (existingProduct) {
    // If product already in cart, just increase its quantity
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    // If product not in cart, add it with quantity 1
    const productToAdd = { ...all_products_json[id], quantity: 1 };
    product_cart.push(productToAdd);
    btn.classList.add("active"); // Mark the add button as active
  }

  add_items_tocart(); // Update cart display and save to Local Storage
}

let price_cart_head = document.querySelector(".price-cart-head");
let total_price_items = document.querySelector(".price-cart-total");
let items_in_cart = document.querySelector(".items_in_cart");

function add_items_tocart() {
  let total_price = 0;
  let itemsc = "";
  let total_items_count = 0; // To count total number of items (quantities included)

  if (product_cart.length === 0) {
    // Handle empty cart display
    itemsc = `<p class="empty-cart-message">Your cart is empty.</p>`;
  } else {
    for (let i = 0; i < product_cart.length; i++) {
      const product = product_cart[i];
      const itemQuantity = product.quantity || 1; // Ensure quantity exists, default to 1
      const itemSubtotal = product.price * itemQuantity;

      itemsc += `
                <div class="product-cart">
                    <img src="${product.img}" alt="" />
                    <div class="details-pro">
                        <span class="name-item">${product.name}</span>
                        <p> $${itemSubtotal.toFixed(2)}</p>
                        <div class="plus-minus">
                            <span class="minus" onclick="changeQuantity(${
                              product.id
                            }, -1)">-</span>
                            <span class="count-item">${itemQuantity}</span>
                            <span class="plus" onclick="changeQuantity(${
                              product.id
                            }, 1)">+</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-trash" onclick="remove_items(${
                      product.id
                    })"></i>
                </div>
            `;

      total_price += itemSubtotal;
      total_items_count += itemQuantity;
    }
  }
  cart_products.innerHTML = itemsc;
  if (Check_products) {
    Check_products.innerHTML = itemsc;
  }

  price_cart_head.innerHTML = `$${total_price.toFixed(2)}`;
  total_price_items.innerHTML = `$${total_price.toFixed(2)}`;

  count_cart_element.innerHTML = total_items_count; // Display total quantity of items
  items_in_cart.innerHTML = `( ${total_items_count} Items In Cart)`;
  checkout_total.innerHTML = `$${(total_price + 20).toFixed(2)}`;
  // Save to Local Storage
  localStorage.setItem("cartProducts", JSON.stringify(product_cart));

  // Update 'Add to Cart' button states
  updateAddToCartButtons();
}

function remove_items(id) {
  product_cart = product_cart.filter((product) => product.id !== id);
  add_items_tocart(); // Re-render cart and save updated state

  // No need to manually update buttons here, add_items_tocart calls updateAddToCartButtons()
}

// Function to handle quantity changes
function changeQuantity(id, change) {
  const product = product_cart.find((item) => item.id === id);

  if (product) {
    product.quantity = (product.quantity || 1) + change; // Add or subtract change

    if (product.quantity <= 0) {
      remove_items(id); // If quantity drops to 0 or less, remove the item from cart
    } else {
      add_items_tocart(); // Update cart display and save to local storage
    }
  }
}

// Function to update the 'active' class on 'Add to Cart' buttons
function updateAddToCartButtons() {
  let addToCartBtns = document.querySelectorAll(".add-to-cart");
  addToCartBtns.forEach((btn) => {
    // Extract product ID from the onclick attribute
    const onclickAttr = btn.getAttribute("onclick");
    if (onclickAttr) {
      const match = onclickAttr.match(/add_to_cart\((\d+)/);
      if (match && match[1]) {
        const productId = parseInt(match[1]);
        // Check if any product in cart has this ID
        if (product_cart.some((product) => product.id === productId)) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    }
  });
}

// Function to load cart from Local Storage on page load
function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem("cartProducts");
  if (storedCart) {
    product_cart = JSON.parse(storedCart);
    add_items_tocart(); // Display loaded cart items
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ده هيضمن إن الـ DOM كله بقى جاهز قبل ما نحاول نوصل للعناصر
  loadCartFromLocalStorage();
});
