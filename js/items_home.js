



  function initializeSwipers() {
var swiper = new Swiper(".swiper", {
  pagination: {
    el: ".swiper-pagination",
    dynamicBullests: true,
    clickable: true,
  },
  autoplay: {
    delay: 2500,
  },
  loop: true,
});

var swiper = new Swiper(".sale_sec", {
    slidesPerView: 5,
    spaceBetween:30,
    autoplay:{
       delay:3000,
    },
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev"
    },
    loop:true,
    breakpoints:{
      1600:{
        slidesPerView: 5,
      },
      1200:{
        slidesPerView: 4,
        spaceBetween:30,
      },
      700:{
        slidesPerView: 3,
        spaceBetween:15,
      },
      0:{
        slidesPerView: 2,
        spaceBetween:10,
      },
    }
  });
  var swiper = new Swiper(".sale_sec2", {
    slidesPerView: 4,
    spaceBetween:30,
    autoplay:{
       delay:3000,
    },
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev"
    },
    loop:true,
    breakpoints:{
      1500:{
        slidesPerView: 4,
      },
      1200:{
        slidesPerView: 3,
        spaceBetween:30,
      },
      900:{
        slidesPerView: 2,
        spaceBetween:15,
      },
      700:{
        slidesPerView: 3,
        spaceBetween:15,
      },
      0:{
        slidesPerView: 2,
        spaceBetween:10,
      },
    }
  });

}



fetch("js/items.json")
  .then((response) => response.json())
  .then((data) => {
    all_products_json = data;
    // تخزين كل العناصر المستهدفة في مصفوفة لسهولة التكرار عليها
    const swiperTargets = [
      document.getElementById("swiper_items_sale"),
      document.getElementById("other_product_swiper"),
      document.getElementById("other_product_swiper2"),
      document.getElementById("swiper_items_sale2"),
    ];

    function createProductHTML(product) {
      if (!product.old_price) {
        return "";
      }

      const percent_sale = Math.floor(
        ((product.old_price - product.price) / product.old_price) * 100
      );

      return `
        <div class="product swiper-slide">
          <span class="sale">%${percent_sale}</span>
          <div class="icons-product">
            <span class="add-to-cart" onclick="add_to_cart(${product.id},this), add_items_tocart()"><i class="fa-solid fa-cart-plus"></i></span>
            <span><i class="fa-solid fa-heart"></i></span>
            <span><i class="fa-solid fa-share"></i></span>
          </div>
          <div class="img">
            <img src="${product.img}" alt="" />
            <img class="img-hover" src="${product.img_hover}" alt="" />
          </div>
          <p class="name-product">${product.name}</p>
          <div class="stars">
            <i class="fa-solid fa-star"></i> <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="price-old">
            <span>$${product.price}</span>
            <p>$${product.old_price}</p>
          </div>
        </div>
      `;
    }

    // تصفية المنتجات مرة واحدة للحصول على المنتجات التي عليها خصم فقط
    const productsOnSale = data.filter((product) => product.old_price);

    // توليد قالب HTML لجميع منتجات الخصم في خطوة واحدة
    const allProductsHTML = productsOnSale.map(createProductHTML).join("");

    // المرور على العناصر المستهدفة وإضافة قالب HTML الذي تم توليده
    swiperTargets.forEach((element) => {
      if (element) {
        // التحقق من وجود العنصر قبل التعديل عليه
        element.innerHTML += allProductsHTML;
      }
    });
    initializeSwipers();
  });
