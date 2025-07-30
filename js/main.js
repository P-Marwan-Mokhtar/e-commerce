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

// متغيرات العربة الأساسية
var all_products_json; // بيانات المنتجات من الـ API
let Check_products = document.getElementById("checkout-items");
let cart_products = document.querySelector(".cart-products");
let checkout_total = document.querySelector(".total_checkout");
let product_cart = []; // مصفوفة المنتجات في العربة
let count_cart_element = document.querySelector(".count-cart");

// معرض الصور
let imgs = document.querySelectorAll(".imgs img");
let main_img = document.querySelector(".main-img img");
imgs.forEach((img) => {
  img.addEventListener("click", () => {
    main_img.src = img.src;
  });
});

// إضافة منتج للعربة
function add_to_cart(id, btn) {
  if (!all_products_json || !all_products_json[id]) {
    console.error("Product data not found for ID:", id);
    return;
  }

  // البحث عن المنتج في العربة
  let existingProduct = product_cart.find(
    (product) => product.id === all_products_json[id].id
  );

  if (existingProduct) {
    // لو المنتج موجود، زود الكمية
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    // لو المنتج مش موجود، ضيفه للعربة
    const productToAdd = { ...all_products_json[id], quantity: 1 };
    product_cart.push(productToAdd);
    
    // خلي الزرار active
    btn.classList.add("active");
  }

  // حديث العربة
  update_cart();
}

// عناصر الأسعار
let price_cart_head = document.querySelector(".price-cart-head");
let total_price_items = document.querySelector(".price-cart-total");
let items_in_cart = document.querySelector(".items_in_cart");

// تحديث محتويات العربة
function update_cart() {
  let total_price = 0;
  let itemsc = "";
  let total_items_count = 0;

  if (product_cart.length === 0) {
    // العربة فاضية
    itemsc = `<p class="empty-cart-message">Your cart is empty.</p>`;
  } else {
    // عرض المنتجات في العربة
    for (let i = 0; i < product_cart.length; i++) {
      const product = product_cart[i];
      const itemQuantity = product.quantity || 1;
      const itemSubtotal = product.price * itemQuantity;

      itemsc += `
        <div class="product-cart">
          <img src="${product.img}" alt="" />
          <div class="details-pro">
            <span class="name-item">${product.name}</span>
            <p> $${itemSubtotal.toFixed(2)}</p>
            <div class="plus-minus">
              <span class="minus" onclick="changeQuantity(${product.id}, -1)">-</span>
              <span class="count-item">${itemQuantity}</span>
              <span class="plus" onclick="changeQuantity(${product.id}, 1)">+</span>
            </div>
          </div>
          <i class="fa-solid fa-trash" onclick="remove_items(${product.id})"></i>
        </div>
      `;

      total_price += itemSubtotal;
      total_items_count += itemQuantity;
    }
  }

  // تحديث العرض
  cart_products.innerHTML = itemsc;
  if (Check_products) {
    Check_products.innerHTML = itemsc;
  }

  price_cart_head.innerHTML = `$${total_price.toFixed(2)}`;
  total_price_items.innerHTML = `$${total_price.toFixed(2)}`;

  count_cart_element.innerHTML = total_items_count;
  items_in_cart.innerHTML = `( ${total_items_count} Items In Cart)`;

  // حفظ في التخزين المحلي
  localStorage.setItem("cartProducts", JSON.stringify(product_cart));
  
  // حفظ IDs المنتجات فقط (عشان الأزرار)
  const cart_ids = product_cart.map(product => product.id);
  localStorage.setItem("cartIds", JSON.stringify(cart_ids));

  // تحديث أزرار Add to Cart
  update_buttons();
}

// حذف منتج من العربة
function remove_items(id) {
  product_cart = product_cart.filter((product) => product.id !== id);
  update_cart();
}

// تغيير كمية المنتج
function changeQuantity(id, change) {
  const product = product_cart.find((item) => item.id === id);

  if (product) {
    product.quantity = (product.quantity || 1) + change;

    if (product.quantity <= 0) {
      remove_items(id);
    } else {
      update_cart();
    }
  }
}

// تحديث أزرار Add to Cart (مبسط وسهل)
function update_buttons() {
  // جيب كل الأزرار
  let buttons = document.querySelectorAll(".add-to-cart");
  
  // جيب IDs المنتجات اللي في العربة
  const cart_ids = product_cart.map(product => product.id);
  
  // لف على كل زرار
  buttons.forEach((btn) => {
    // استخرج ID المنتج من الزرار
    const onclick_text = btn.getAttribute("onclick");
    if (onclick_text) {
      const id_match = onclick_text.match(/add_to_cart\((\d+)/);
      if (id_match && id_match[1]) {
        const product_id = parseInt(id_match[1]);
        
        // لو المنتج في العربة، خلي الزرار active
        if (cart_ids.includes(product_id)) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    }
  });
}

// تحميل العربة من التخزين المحلي
function load_cart() {
  const saved_cart = localStorage.getItem("cartProducts");
  if (saved_cart) {
    try {
      product_cart = JSON.parse(saved_cart);
      update_cart();
    } catch (error) {
      console.error("خطأ في تحميل العربة:", error);
      product_cart = [];
    }
  }
}

// تحديث سريع للأزرار بدون بيانات المنتجات
function quick_button_update() {
  const saved_ids = localStorage.getItem("cartIds");
  if (!saved_ids) return;
  
  const cart_ids = JSON.parse(saved_ids);
  let buttons = document.querySelectorAll(".add-to-cart");
  
  buttons.forEach((btn) => {
    const onclick_text = btn.getAttribute("onclick");
    if (onclick_text) {
      const id_match = onclick_text.match(/add_to_cart\((\d+)/);
      if (id_match && id_match[1]) {
        const product_id = parseInt(id_match[1]);
        
        if (cart_ids.includes(product_id)) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    }
  });
}

// استدعي دي لما بيانات المنتجات تتحمل من الـ API
function products_loaded() {
  // دلوقتي نقدر نحدث الأزرار صح
  update_buttons();
}

// بداية تشغيل الكود
document.addEventListener("DOMContentLoaded", () => {
  // حمل العربة من التخزين
  load_cart();
  
  // تحديث سريع للأزرار (فورًا)
  setTimeout(() => {
    quick_button_update();
  }, 100);
});

/*
ملحوظة مهمة:
في مكان تحميل بيانات المنتجات من الـ API، ضيف:

fetch('your-api-endpoint')
  .then(response => response.json())
  .then(data => {
    all_products_json = data;
    products_loaded(); // ← المهم ده!
  });
*/